<template>
  <div class="wrapper">
    <el-tabs v-model="activeTab" class="tabs">
      <el-tab-pane
        :label="item.title"
        :name="item.title"
        v-for="(item, i) in wap"
        :key="i"
      >
        <component
          ref="mallecoComponentRef"
          :is="templateWay[item.name]"
          @selected="
            (val) => {
              changed = val
            }
          "
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from 'vue'
import { useRoute } from 'vue-router'
import templateWay from './template/index'

const route = useRoute()
const emit = defineEmits<{
  selectedLink: [link: string]
}>()

const mallecoComponentRef = ref()
const changed = ref('')
const selected = ref(0)
const selectedLink = ref('')
const wap = ref([
  { title: '商品', url: '1', name: 'goods' },
  { title: '分类', url: '2', name: 'category' },
  { title: '店铺', url: '3', name: 'shops' },
  { title: '页面', url: '4', name: 'pages' },
  { title: '其他', url: '5', name: 'other' }
])

const activeTab = ref(wap.value[0]?.title || '')

watch(changed, (val) => {
  if (val && val.length > 0) {
    emit('selectedLink', val[0]) // 因为是单选，所以直接返回第一个
  }
})

watch(
  () => activeTab.value,
  (val) => {
    const item = wap.value.find((w) => w.title === val)
    if (item) {
      wap.value.forEach((w) => (w.selected = false))
      item.selected = true
      selected.value = wap.value.indexOf(item)
    }
  }
)

onMounted(() => {
  nextTick(() => {
    if (mallecoComponentRef.value && mallecoComponentRef.value[0]) {
      ;(mallecoComponentRef.value[0] as any).type = 'single' // 商品页面设置成为单选
    }
  })

  const url = window.location.href
  if (url.indexOf('/floorList/renovation') !== -1) {
    // 去重
    const obj: any = {}
    wap.value = wap.value.reduce((cur: any[], next: any) => {
      if (next.title !== undefined) {
        obj[next.title] ? '' : (obj[next.title] = true && cur.push(next))
      }
      return cur
    }, [])
    if (route.path !== '/floorList/main') {
      wap.value = wap.value.filter((items) => items.title !== '活动')
    }
  } else {
    wap.value.push({
      title: '活动',
      url: '3',
      name: 'marketing'
    })
    // 去重
    const obj: any = {}
    wap.value = wap.value.reduce((cur: any[], next: any) => {
      if (next.title !== undefined) {
        obj[next.title] ? '' : (obj[next.title] = true && cur.push(next))
      }
      return cur
    }, [])
  }

  wap.value.forEach((item) => {
    if (item) {
      item.selected = false
    }
  })
  
  // 设置默认激活的 tab
  if (wap.value.length > 0) {
    activeTab.value = wap.value[0].title
  }
})
</script>

<style scoped lang="scss">
.wrapper {
  padding: 20px;
}

.tabs {
  width: 100%;
}
</style>

