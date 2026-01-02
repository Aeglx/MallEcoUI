<template>
  <div class="error-page">
    <div class="error-content">
      <h1>500</h1>
      <p>服务器内部错误，请稍后再试</p>
      <el-button type="primary" @click="goHome">返回首页</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push({ name: 'home_index' })
}
</script>

<style scoped lang="scss">
.error-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #f0f0f0;
}

.error-content {
  text-align: center;
  h1 {
    font-size: 72px;
    color: #e6a23c;
    margin-bottom: 20px;
  }
  p {
    font-size: 16px;
    color: #666;
    margin-bottom: 30px;
  }
}
</style>

