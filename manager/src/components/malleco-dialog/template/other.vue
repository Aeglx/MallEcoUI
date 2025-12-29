<template>
  <div class="template-wrapper">
    <div class="other-list">
      <div
        class="other-item"
        :class="{ active: item.selected }"
        @click="selectOther(item)"
        v-for="(item, index) in otherList"
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

const otherList = ref([
  { title: '首页', url: '/', selected: false },
  { title: '购物车', url: '/cart', selected: false },
  { title: '我的订单', url: '/home/MyOrder', selected: false },
  { title: '收藏商品', url: '/home/Favorites', selected: false },
  { title: '个人中心', url: '/home', selected: false },
  { title: '秒杀频道', url: '/seckill', selected: false },
  { title: '领券中心', url: '/coupon', selected: false }
])

const selectOther = (item: any) => {
  otherList.value.forEach((o) => (o.selected = false))
  item.selected = true
  emit('selected', [item])
}
</script>

<style scoped lang="scss">
.template-wrapper {
  padding: 20px;
}

.other-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.other-item {
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

