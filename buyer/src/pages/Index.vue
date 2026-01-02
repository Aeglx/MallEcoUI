<template>
  <div class="index-container">
    <!-- 顶部导航栏 -->
    <Header />
    
    <!-- 搜索框和Logo区域 -->
    <div class="search-wrapper">
      <div class="search-container width_1200_auto">
        <Search />
      </div>
    </div>
    
    <!-- 分类导航栏 -->
    <div class="nav-wrapper" v-if="showNav">
      <CateNav 
        :showAlways="false" 
        :large="carouselLarge" 
        :opacity="carouselOpacity"
        :showNavBar="true"
      />
    </div>
    
    <!-- 主要内容区域：楼层装修 -->
    <div class="main-content">
      <ModelForm :pageData="pageData" />
    </div>
    
    <!-- 底部信息栏 -->
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { indexData } from '@/api/index'
import Header from '@/components/header/Header.vue'
import Footer from '@/components/footer/Footer.vue'
import Search from '@/components/Search.vue'
import ModelForm from '@/components/indexDecorate/ModelForm.vue'
import CateNav from '@/components/nav/CateNav.vue'
import storage from '@/utils/storage'

const pageData = ref<any>(null)
const showNav = ref(false) // 是否展示分类栏
const carouselLarge = ref(false) // 不同轮播分类尺寸
const carouselOpacity = ref(false) // 不同轮播分类样式

const getPageData = async () => {
  try {
    const res = await indexData({ clientType: 'PC' })
    const data = res.data || res
    if (data.success && data.result) {
      // 如果pageData是字符串，需要解析
      let parsedData
      if (typeof data.result.pageData === 'string') {
        parsedData = JSON.parse(data.result.pageData)
      } else {
        parsedData = data.result.pageData
      }
      
      pageData.value = parsedData
      
      // 解析页面数据，判断轮播类型
      if (parsedData?.list) {
        for (let i = 0; i < parsedData.list.length; i++) {
          const type = parsedData.list[i].type
          if (type === 'carousel2') {
            carouselLarge.value = true
          } else if (type === 'carousel1') {
            carouselLarge.value = true
            carouselOpacity.value = true
          } else if (type === 'carousel') {
            // carousel 类型默认显示分类导航
            showNav.value = true
          }
        }
        
        // 存储导航列表（通常是第二个模块或轮播图后面的模块）
        const navModule = parsedData.list.find((item: any) => item.type === 'navList' || item.type === 'navigation') || parsedData.list[1]
        if (navModule) {
          storage.setItem('navList', JSON.stringify(navModule))
          if (!showNav.value) {
            showNav.value = true
          }
        }
      }
    }
  } catch (error) {
    console.error('获取首页数据失败:', error)
  }
}

onMounted(() => {
  getPageData()
})
</script>

<style lang="scss" scoped>
.index-container {
  width: 100%;
  min-height: 100vh;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
}

.search-wrapper {
  width: 100%;
  background-color: #ffffff;
  border-bottom: 1px solid #e5e5e5;
}

.search-container {
  padding: 20px 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-wrapper {
  width: 100%;
  background-color: #ffffff;
  border-bottom: 1px solid #e5e5e5;
}

.main-content {
  flex: 1;
  width: 100%;
  background-color: #f5f5f5;
}

.width_1200_auto {
  width: 1200px;
  margin: 0 auto;
}
</style>
