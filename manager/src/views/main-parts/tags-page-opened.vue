<template>
  <div
    ref="scrollConRef"
    @DOMMouseScroll="handleScroll"
    @mousewheel="handleScroll"
    class="tags-outer-scroll-con"
  >
    <ul
      v-show="visible"
      :style="{ left: contextMenuLeft + 'px', top: contextMenuTop + 'px' }"
      class="contextmenu"
    >
      <li v-for="(item, key) in actionList" @click="handleTagsOption(key)" :key="key">
        {{ item }}
      </li>
    </ul>
    <div ref="scrollBodyRef" class="tags-inner-scroll-body" :style="{ left: tagBodyLeft + 'px' }">
      <transition-group name="taglist-moving-animation">
        <el-tag
          v-for="item in pageTagsList"
          :ref="(el) => addTagRef(el, item.name)"
          :key="item.name"
          :closable="item.name !== 'home_index'"
          :type="
            item.children
              ? item.children[0].name === currentPageName
                ? 'primary'
                : 'info'
              : item.name === currentPageName
              ? 'primary'
              : 'info'
          "
          @close="(e) => closePage(e, item.name)"
          @click="linkTo(item)"
          @contextmenu.prevent="contextMenu(item, $event)"
          style="cursor: pointer; margin-right: 8px;"
        >
          {{ itemTitle(item) }}
        </el-tag>
      </transition-group>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAppStore } from '@/stores/app'
import type { PageTag } from '@/stores/app'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const appStore = useAppStore()

const scrollConRef = ref<HTMLElement>()
const scrollBodyRef = ref<HTMLElement>()
const tagsRefs = ref<Map<string, any>>(new Map())

const currentPageName = ref(route.name as string)
const tagBodyLeft = ref(0)
const visible = ref(false)
const contextMenuLeft = ref(0)
const contextMenuTop = ref(0)

const actionList = {
  others: '关闭其他',
  clearAll: '关闭所有'
}

const props = defineProps<{
  pageTagsList: PageTag[]
  beforePush?: (item: PageTag) => boolean
}>()

const pageTagsList = computed(() => props.pageTagsList)

const addTagRef = (el: any, name: string) => {
  if (el) {
    tagsRefs.value.set(name, el)
  }
}

const itemTitle = (item: PageTag) => {
  if (typeof item.title === 'object' && item.title !== null) {
    return t((item.title as any).i18n)
  } else {
    return item.title
  }
}

const closePage = (event: Event, itemName: string) => {
  const pageOpenedList = appStore.pageOpenedList
  const targetName = itemName
  
  if (!targetName) return
  
  let lastPageObj = pageOpenedList[0]

  if (currentPageName.value === targetName) {
    const len = pageOpenedList.length
    for (let i = 1; i < len; i++) {
      if (pageOpenedList[i].name === targetName) {
        if (i < len - 1) {
          lastPageObj = pageOpenedList[i + 1]
        } else {
          lastPageObj = pageOpenedList[i - 1]
        }
        break
      }
    }
  } else {
    const target = event.target as HTMLElement
    const tagWidth = target.closest('.el-tag')?.offsetWidth || 0
    tagBodyLeft.value = Math.min(tagBodyLeft.value + tagWidth, 0)
  }

  appStore.removeTag(targetName)
  appStore.closePage(targetName)

  if (currentPageName.value === targetName) {
    linkTo(lastPageObj)
  }
}

const linkTo = (item: PageTag) => {
  if (route.name === item.name) {
    return
  }

  const routerObj: any = {
    name: item.name
  }

  if (item.argu) {
    routerObj.params = item.argu
  }
  if (item.query) {
    routerObj.query = item.query
  }

  if (!props.beforePush || props.beforePush(item)) {
    router.push(routerObj)
  }
}

const handleScroll = (e: WheelEvent) => {
  const type = e.type
  let delta = 0

  if (type === 'DOMMouseScroll' || type === 'mousewheel') {
    delta = (e as any).wheelDelta ? (e as any).wheelDelta : -(e.detail || 0) * 40
  }

  let left = 0
  if (delta > 0) {
    left = Math.min(0, tagBodyLeft.value + delta)
  } else {
    if (scrollConRef.value && scrollBodyRef.value) {
      const scrollConWidth = scrollConRef.value.offsetWidth
      const scrollBodyWidth = scrollBodyRef.value.offsetWidth

      if (scrollConWidth - 100 < scrollBodyWidth) {
        if (tagBodyLeft.value < -(scrollBodyWidth - scrollConWidth + 100)) {
          left = tagBodyLeft.value
        } else {
          left = Math.max(tagBodyLeft.value + delta, scrollConWidth - scrollBodyWidth - 100)
        }
      } else {
        tagBodyLeft.value = 0
      }
    }
  }
  tagBodyLeft.value = left
}

const handleTagsOption = (type: string) => {
  if (type === 'clearAll') {
    appStore.clearAllTags()
    router.push({
      name: 'home_index'
    })
  } else {
    appStore.clearOtherTags(currentPageName.value as string)
  }
  tagBodyLeft.value = 0
  visible.value = false
}

const moveToView = (tag: HTMLElement) => {
  if (!scrollConRef.value) return

  if (tag.offsetLeft < -tagBodyLeft.value) {
    // 标签在可视区域左侧
    tagBodyLeft.value = -tag.offsetLeft + 10
  } else if (
    tag.offsetLeft + 10 > -tagBodyLeft.value &&
    tag.offsetLeft + tag.offsetWidth <
      -tagBodyLeft.value + scrollConRef.value.offsetWidth - 100
  ) {
    // 标签在可视区域
    tagBodyLeft.value = Math.min(
      0,
      scrollConRef.value.offsetWidth - 100 - tag.offsetWidth - tag.offsetLeft - 20
    )
  } else {
    // 标签在可视区域右侧
    tagBodyLeft.value = -(
      tag.offsetLeft -
      (scrollConRef.value.offsetWidth - 100 - tag.offsetWidth) +
      20
    )
  }
}

const contextMenu = (item: PageTag, e: MouseEvent) => {
  visible.value = true
  if (scrollConRef.value) {
    const offsetLeft = scrollConRef.value.getBoundingClientRect().left
    contextMenuLeft.value = e.clientX - offsetLeft + 10
    contextMenuTop.value = e.clientY - 64
  }
}

const closeMenu = () => {
  visible.value = false
}

onMounted(() => {
  setTimeout(() => {
    tagsRefs.value.forEach((tag, name) => {
      if (route.name === name) {
        // Element Plus 组件，ref 获取的是组件实例，需要访问 $el
        const el = tag?.$el || tag
        if (el) {
          moveToView(el instanceof HTMLElement ? el : el.$el || el)
        }
      }
    })
  }, 1)

  if (visible.value) {
    document.body.addEventListener('click', closeMenu)
  }
})

watch(
  () => route.name,
  (to) => {
    if (to) {
      currentPageName.value = to as string
      nextTick(() => {
        tagsRefs.value.forEach((tag, name) => {
          if (to === name) {
            // Element Plus 组件，ref 获取的是组件实例，需要访问 $el
            const el = tag?.$el || tag
            if (el) {
              moveToView(el instanceof HTMLElement ? el : el.$el || el)
            }
          }
        })
      })
    }
  }
)

watch(visible, (value) => {
  if (value) {
    document.body.addEventListener('click', closeMenu)
  } else {
    document.body.removeEventListener('click', closeMenu)
  }
})

onUnmounted(() => {
  document.body.removeEventListener('click', closeMenu)
})
</script>

<style lang="scss" scoped>
@import '@/views/main.scss';

.contextmenu {
  position: absolute;
  margin: 0;
  padding: 5px 0;
  background: #fff;
  z-index: 11000;
  list-style-type: none;
  border-radius: 4px;
  box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.1);
  li {
    margin: 0;
    padding: 5px 15px;
    cursor: pointer;
    &:hover {
      background: #eee;
    }
  }
}

:deep(.el-tag--primary) {
  background-color: $theme_color;
  border-color: $theme_color;
  color: #fff;
}
</style>

