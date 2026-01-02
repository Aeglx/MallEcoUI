<template>
  <div class="cate-nav width_1200_auto" :class="{ 'fixed-show': useClass == 'fixed-show' }">
    <div class="nav-con" :class="{ 'background-white': useClass == 'background-white' }">
      <div
        class="all-categories hover-pointer"
        @mouseenter="showFirstLists"
        @mouseleave="showFirstList = false"
      >
        商品分类
      </div>
      <ul class="nav-item" v-if="showNavBar">
        <li
          class="nav-lis flex flex-a-c flex-j-c"
          v-for="(item, index) in navList.list"
          :key="index"
          @click="linkTo(item.url)"
        >
          {{ item.name }}
          <div class="colum" v-if="index !== navList.list.length - 1"></div>
        </li>
      </ul>
    </div>
    <!-- 全部商品分类 -->
    <div
      v-show="showAlways || showFirstList"
      class="cate-list"
      :style="{ top: !showNavBar ? '60px' : '46px' }"
      @mouseenter="showFirstList = true"
      @mouseleave="showFirstList = false"
    >
      <!-- 第一级分类 -->
      <div
        class="nav-side"
        :class="{ 'large-nav': large, 'opacity-nav': opacity }"
        @mouseleave="panel = false"
      >
        <ul>
          <li
            v-for="(item, index) in cateList"
            :key="index"
            @mouseenter="showDetail(index)"
          >
            <span class="nav-side-item" @click="goGoodsList(item.id)">{{
              item.name
            }}</span>
            <span v-for="(second, secIndex) in item.children" :key="secIndex">
              <span v-if="secIndex < 2"> / </span>
              <span
                @click="goGoodsList(second.id, second.parentId)"
                class="nav-side-item"
                v-if="secIndex < 2"
                >{{ second.name }}</span
              >
            </span>
          </li>
        </ul>
      </div>
      <!-- 展开分类 -->
      <div
        class="detail-item-panel"
        :style="{ minHeight: large ? '470px' : '340px' }"
        v-show="panel"
        @mouseenter="panel = true"
        @mouseleave="panel = false"
      >
        <div
          class="detail-item"
          v-for="(item, index) in panelData"
          :key="index"
          @click="goGoodsList(item.id, item.parentId)"
        >
          <span class="detail-item-title">{{ item.name }}</span>
          <span
            class="detail-item-child"
            v-for="(child, childIndex) in item.children"
            :key="childIndex"
            @click.stop="goGoodsList(child.id, item.id, item.parentId)"
            >{{ child.name }}</span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getCategory } from '@/api/goods'
import storage from '@/utils/storage'

const props = withDefaults(
  defineProps<{
    showAlways?: boolean // 总是显示下拉分类
    showNavBar?: boolean // 显示全部商品分类右侧导航条
    hover?: boolean
    large?: boolean // 是否更高的高度
    opacity?: boolean // 是否背景透明
    useClass?: string
  }>(),
  {
    showAlways: false,
    showNavBar: true,
    hover: false,
    large: false,
    opacity: false,
    useClass: ''
  }
)

const router = useRouter()
const panel = ref(false) // 二级分类展示
const panelData = ref<any[]>([]) // 二级分类数据
const showFirstList = ref(false) // 始终展示一级列表
const cateList = ref<any[]>([]) // 商品分类

const navList = computed(() => {
  // 导航列表
  if (storage.getItem('navList')) {
    return JSON.parse(storage.getItem('navList') || '{}')
  } else {
    return { list: [] }
  }
})

const showFirstLists = () => {
  showFirstList.value = true
  if (
    localStorage.getItem('category') &&
    localStorage.getItem('category_expiration_time')
  ) {
    // 如果缓存过期，则获取最新的信息
    if (new Date() > new Date(localStorage.getItem('category_expiration_time') || 0)) {
      getCate()
      return
    }
    cateList.value = JSON.parse(localStorage.getItem('category') || '[]')
  } else {
    getCate()
  }
}

const getCate = () => {
  // 获取分类数据
  if (props.hover) return
  getCategory('0').then((res: any) => {
    const data = res.data || res
    if (data.success) {
      cateList.value = data.result || []
      // 过期时间
      const expirationTime = new Date().setHours(new Date().getHours() + 1)
      // 存放过期时间
      localStorage.setItem('category_expiration_time', expirationTime.toString())
      // 存放分类信息
      localStorage.setItem('category', JSON.stringify(cateList.value))
    }
  })
}

const showDetail = (index: number) => {
  // 展示全部分类
  panel.value = true
  panelData.value = cateList.value[index]?.children || []
}

const goGoodsList = (id: string, secondId?: string, firstId?: string) => {
  // 分类共有三级，传全部分类过去
  const arr = [firstId, secondId, id].filter(Boolean)
  if (!arr[0]) {
    arr.shift()
  }
  const routeUrl = router.resolve({
    path: '/goodsList',
    query: { categoryId: arr.toString() }
  })
  window.open(routeUrl.href, '_blank')
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

onMounted(() => {
  if (
    localStorage.getItem('category') &&
    localStorage.getItem('category_expiration_time')
  ) {
    // 如果缓存过期，则获取最新的信息
    if (new Date() > new Date(localStorage.getItem('category_expiration_time') || 0)) {
      getCate()
      return
    }
    cateList.value = JSON.parse(localStorage.getItem('category') || '[]')
  } else {
    getCate()
  }
})
</script>

<style lang="scss" scoped>
.background-white {
  background: #fff;
}

.nav-lis:hover {
  color: $theme_color !important;
  cursor: pointer;
}

.nav-lis {
  width: 103px;
  text-align: center;
  position: relative;
}

.fixed-show {
  margin-top: 0 !important;
  > .nav-con {
    > .all-categories {
      align-items: center !important;
      height: 60px;
      display: inherit;
      justify-content: center;
      padding: 0 !important;
    }
  }
}

.colum {
  height: 14.7px;
  opacity: 1;
  border: 0.7px solid #cbc8c8;
  position: absolute;
  right: 0;
}

.cate-nav {
  position: relative;
  margin: 14px auto 0 auto;
}

.nav-con {
  height: 46px;
  margin: 0 auto;
  display: flex;
  .all-categories {
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    padding-left: 37.4px;
    background: #ffffff;
    width: 263.2px;
    padding-top: 15.4px;
    line-height: 20px;
    border-bottom: none;
    font-size: 16.8px;
    font-weight: normal;
    color: #333333;
    letter-spacing: 0px;
  }
  .nav-item {
    width: 914px;
    height: 46px;
    border-radius: 10px;
    background: #ffffff;
    margin-left: 10px;
    line-height: 46px;
    overflow: hidden;
    list-style: none;
    display: flex;
    li {
      float: left;
      font-size: 17px;
      font-weight: normal;
      color: #333333;

      &:hover {
        color: $theme_color;
      }
    }
  }
}

.cate-list {
  margin: 0 auto;
  position: absolute;
  z-index: 1000;
  left: 0;
  right: 0;
  width: 1200px;
  transition: opacity 0.2s ease;
}

.nav-side {
  width: 263.2px;
  color: #666;
  float: left;
  overflow: hidden;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  background-color: #fff;
  height: 340px;

  &.large-nav {
    height: 470px;
    
    ul > li {
      line-height: 20px;
    }
  }

  &.opacity-nav {
    background-color: rgba(0, 0, 0, 0.5);
  }

  ul {
    width: 100%;
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  li {
    padding: 0 0 16.2px 37.4px;
    font-size: 13px;
    line-height: 18px;
    cursor: pointer;

    .nav-side-item {
      color: #333;

      &:hover {
        color: $theme_color;
      }
    }
  }
}

.detail-item-panel {
  width: 1000px;
  min-height: 340px;
  background-color: #fff;
  box-shadow: 0px 0px 15px #ccc;
  position: absolute;
  top: 0;
  left: 263.2px;
  z-index: 1000;
  padding: 15px;

  .detail-item {
    margin-bottom: 20px;

    .detail-item-title {
      font-size: 16px;
      font-weight: bold;
      color: $theme_color;
      margin-right: 20px;
      cursor: pointer;

      &:hover {
        text-decoration: underline;
      }
    }

    .detail-item-child {
      font-size: 14px;
      color: #666;
      margin-right: 20px;
      cursor: pointer;

      &:hover {
        color: $theme_color;
        text-decoration: underline;
      }
    }
  }
}
</style>

