<template>
  <div class="mix-model" v-if="data?.options">
    <!-- 左侧 -->
    <div class="left-card">
      <MixGoods :data="data" />
    </div>
    <!-- 右侧 -->
    <div class="right-card">
      <MixBrand :data="data" />
    </div>
  </div>
</template>

<script setup lang="ts">
import MixGoods from './mixs/MixGoods.vue'
import MixBrand from './mixs/MixBrand.vue'

defineProps<{
  data: any
}>()
</script>

<style scoped lang="scss">
.mix-model {
  display: flex;
  justify-content: space-between;
  gap: 20px;
}

.left-card,
.right-card {
  width: 584px;
  height: 344px;
  border-radius: 10px;
  opacity: 1;
  background: #ffffff;
  box-shadow: 0px 1px 13px 0px #e5e5e5;
  position: relative;
}
</style>

