<template>
  <div class="topic-page">
    <ModelForm :pageData="pageData" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getTopicData } from '@/api/index'
import ModelForm from '@/components/indexDecorate/ModelForm.vue'

const route = useRoute()
const pageData = ref<any>(null)

const getPageData = async () => {
  try {
    const id = route.params.id as string
    const res = await getTopicData(id)
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
    console.error('获取专题数据失败:', error)
  }
}

onMounted(() => {
  getPageData()
})
</script>

<style lang="scss" scoped>
.topic-page {
  min-height: 100vh;
  background-color: #f5f7fa;
}
</style>

