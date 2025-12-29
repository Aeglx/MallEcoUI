<template>
  <div class="template-wrapper">
    <div class="category-list">
      <div
        class="category-item"
        :class="{ active: item.selected }"
        @click="selectCategory(item)"
        v-for="(item, index) in categoryList"
        :key="index"
      >
        {{ item.name }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getCategoryTree } from '@/api/goods'

const emit = defineEmits<{
  selected: [data: any]
}>()

const categoryList = ref<any[]>([])

const selectCategory = (item: any) => {
  categoryList.value.forEach((c) => (c.selected = false))
  item.selected = true
  emit('selected', [item])
}

onMounted(async () => {
  try {
    const res = await getCategoryTree()
    if (res.success) {
      categoryList.value = (res.result || []).map((item: any) => ({
        ...item,
        selected: false
      }))
    }
  } catch (error) {
    console.error(error)
  }
})
</script>

<style scoped lang="scss">
.template-wrapper {
  padding: 20px;
}

.category-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.category-item {
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

