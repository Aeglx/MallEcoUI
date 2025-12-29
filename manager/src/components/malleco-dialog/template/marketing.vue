<template>
  <div class="template-wrapper">
    <div class="marketing-list">
      <div
        class="marketing-item"
        :class="{ active: item.selected }"
        @click="selectMarketing(item)"
        v-for="(item, index) in marketingList"
        :key="index"
      >
        {{ item.name }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  selected: [data: any]
}>()

const marketingList = ref<any[]>([])

const selectMarketing = (item: any) => {
  marketingList.value.forEach((m) => (m.selected = false))
  item.selected = true
  emit('selected', [item])
}

// TODO: 从 API 获取营销活动列表
</script>

<style scoped lang="scss">
.template-wrapper {
  padding: 20px;
}

.marketing-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.marketing-item {
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

