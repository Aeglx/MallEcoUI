<template>
  <div class="template-wrapper">
    <div class="special-list">
      <div
        class="special-item"
        :class="{ active: item.selected }"
        @click="selectSpecial(item)"
        v-for="(item, index) in specialList"
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

const specialList = ref<any[]>([])

const selectSpecial = (item: any) => {
  specialList.value.forEach((s) => (s.selected = false))
  item.selected = true
  emit('selected', [item])
}

// TODO: 从 API 获取专题列表
</script>

<style scoped lang="scss">
.template-wrapper {
  padding: 20px;
}

.special-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.special-item {
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

