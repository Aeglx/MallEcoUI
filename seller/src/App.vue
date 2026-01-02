<template>
  <div id="main" class="app-main">
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { onUpdated } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

onUpdated(() => {
  // 可以根据需要加载分类数据
})
</script>

<style>
html,
body {
  width: 100%;
  height: 100%;
  background: #f0f0f0;
  font-size: 12px;
}

.app-main {
  width: 100%;
  height: 100%;
}

.br button {
  margin-right: 5px;
}

.operation button {
  margin-right: 5px;
}

.ivu-btn-text:focus {
  box-shadow: none !important;
}

.ivu-tag {
  cursor: pointer;
}

.tox-notifications-container {
  display: none !important;
}
</style>

