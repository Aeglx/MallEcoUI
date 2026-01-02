<template>
  <div class="home-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>欢迎使用卖家后台</span>
        </div>
      </template>
      <div class="home-content">
        <p>欢迎来到卖家后台管理系统</p>
        <p>功能正在开发中，敬请期待...</p>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
// 首页组件
</script>

<style lang="scss" scoped>
.home-page {
  padding: 20px;

  .card-header {
    font-size: 18px;
    font-weight: bold;
  }

  .home-content {
    padding: 20px 0;
    p {
      margin: 10px 0;
      font-size: 14px;
      color: #666;
    }
  }
}
</style>

