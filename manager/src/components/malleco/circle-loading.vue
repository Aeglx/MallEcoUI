<template>
  <div style="display: inline-block">
    <el-icon :size="18" color="#2d8cf0" class="spin-icon-load">
      <Loading />
    </el-icon>
  </div>
</template>

<script setup lang="ts">
import { Loading } from '@element-plus/icons-vue'
// 加载动画组件
</script>

<style lang="scss" scoped>
.spin-icon-load {
  animation: ani-demo-spin 1s linear infinite;
}

@keyframes ani-demo-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>

