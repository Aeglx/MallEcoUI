<template>
  <div class="placeholder-page">
    <div class="placeholder-content">
      <el-icon :size="80" color="#909399" class="placeholder-icon">
        <Document />
      </el-icon>
      <h2>页面开发中</h2>
      <p>该功能正在开发中，敬请期待...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Document } from '@element-plus/icons-vue'
</script>

<style lang="scss" scoped>
.placeholder-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
  padding: 40px 20px;

  .placeholder-content {
    text-align: center;

    .placeholder-icon {
      margin-bottom: 20px;
      opacity: 0.5;
    }

    h2 {
      font-size: 24px;
      color: #606266;
      margin: 0 0 10px 0;
      font-weight: 500;
    }

    p {
      font-size: 14px;
      color: #909399;
      margin: 0;
    }
  }
}
</style>

