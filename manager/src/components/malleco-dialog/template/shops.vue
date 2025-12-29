<template>
  <div class="template-wrapper">
    <div class="shops-list">
      <div
        class="shop-item"
        :class="{ active: item.selected }"
        @click="selectShop(item)"
        v-for="(item, index) in shopsList"
        :key="index"
      >
        {{ item.storeName }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  selected: [data: any]
}>()

const shopsList = ref<any[]>([])

const selectShop = (item: any) => {
  shopsList.value.forEach((s) => (s.selected = false))
  item.selected = true
  emit('selected', [item])
}

// TODO: 从 API 获取店铺列表
</script>

<style scoped lang="scss">
.template-wrapper {
  padding: 20px;
}

.shops-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.shop-item {
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

