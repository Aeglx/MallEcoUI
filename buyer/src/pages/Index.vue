<template>
  <div class="index-page">
    <ModelForm :pageData="pageData" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { indexData } from '@/api/index'
import ModelForm from '@/components/indexDecorate/ModelForm.vue'

const pageData = ref<any>(null)

const getPageData = async () => {
  try {
    const res = await indexData({ clientType: 'PC' })
    const data = res.data || res
    if (data.success && data.result) {
      // 如果pageData是字符串，需要解析
      if (typeof data.result.pageData === 'string') {
        pageData.value = JSON.parse(data.result.pageData)
      } else {
        pageData.value = data.result.pageData
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
.index-page {
  min-height: 100vh;
  background-color: #f5f7fa;
}
</style>

