<template>
  <div class="template-wrapper">
    <div class="pages-list">
      <div
        class="page-item"
        :class="{ active: item.selected }"
        @click="selectPage(item)"
        v-for="(item, index) in pagesList"
        :key="index"
      >
        {{ item.title }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  selected: [data: any]
}>()

const pagesList = ref<any[]>([])

const selectPage = (item: any) => {
  pagesList.value.forEach((p) => (p.selected = false))
  item.selected = true
  emit('selected', [item])
}

// TODO: 从 API 获取页面列表
</script>

<style scoped lang="scss">
.template-wrapper {
  padding: 20px;
}

.pages-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.page-item {
  padding: 8px 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;

  &.active {
    border-color: #2d8cf0;
    background: #e6f7ff;
    color: #2d8cf0;
  }

  &:hover {
    border-color: #2d8cf0;
  }
}
</style>

