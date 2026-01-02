<template>
  <div class="not-enough" ref="obtain" id="demo">
    <ul class="nav-bar" v-show="topSearchShow">
      <li
        v-for="(item, index) in conData?.options?.navList"
        :class="currentIndex === index ? 'curr' : ''"
        @click="changeCurr(index)"
        :key="index"
      >
        <p @click="gotoDemo">{{ item.title }}</p>
        <p @click="gotoDemo">{{ item.desc }}</p>
      </li>
    </ul>
    <div class="content" v-if="showContent">
      <div
        v-for="(item, index) in conData?.options?.list?.[currentIndex]"
        :key="index"
        class="hover-pointer"
        @click="linkTo(item.url)"
      >
        <img :src="item.img" width="210" height="210" :alt="item.name" />
        <p>{{ item.name }}</p>
        <p>
          <span>¥{{ Number(item.price) }}</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps<{
  data: any
}>()

const router = useRouter()
const topSearchShow = ref(true)
const currentIndex = ref(0)
const showContent = ref(true)

const conData = computed(() => props.data)

onMounted(() => {
  window.addEventListener('scroll', handleScrollx, true)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScrollx, true)
})

const handleScrollx = () => {
  // 滚动处理逻辑
}

const gotoDemo = () => {
  const element = document.querySelector('#demo')
  if (element) {
    element.scrollIntoView(true)
  }
}

const changeCurr = (index: number) => {
  currentIndex.value = index
}

const linkTo = (url: string) => {
  if (url && typeof url === 'string') {
    if (url.startsWith('/')) {
      router.push(url)
    } else if (url.startsWith('http://') || url.startsWith('https://')) {
      window.open(url, '_blank')
    } else {
      router.push(url)
    }
  }
}
</script>

<style lang="scss" scoped>
.nav-bar {
  display: flex;
  justify-content: center;
  width: 100%;
  margin-bottom: 10px;
  background-color: #f8f8f8;
  height: 60px;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 100;

  li {
    padding: 0 30px;
    text-align: center;

    p:nth-child(1) {
      font-size: 16px;
      border-radius: 50px;
      padding: 0 7px;
    }

    p:nth-child(2) {
      font-size: 14px;
      color: #999;
    }

    &:hover {
      p {
        color: $theme_color;
      }
      cursor: pointer;
    }

    border-right: 1px solid #eee;
  }

  li:last-of-type {
    border: none;
  }

  .curr {
    p:nth-child(1) {
      background-color: $theme_color;
      color: #fff;
    }

    p:nth-child(2) {
      color: $theme_color;
    }
  }
}

.content {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;

  > div {
    padding: 10px;
    box-sizing: border-box;
    border: 1px solid #eee;
    margin-bottom: 10px;

    &:hover {
      border-color: $theme_color;
      color: $theme_color;
    }

    p:nth-of-type(1) {
      overflow: hidden;
      width: 210px;
      white-space: nowrap;
      text-overflow: ellipsis;
      margin: 10px 0 5px 0;
    }

    p:nth-of-type(2) {
      color: $theme_color;
      font-size: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      span:nth-child(2) {
        text-decoration: line-through;
        font-size: 12px;
        color: #999;
      }
    }
  }
}
</style>

