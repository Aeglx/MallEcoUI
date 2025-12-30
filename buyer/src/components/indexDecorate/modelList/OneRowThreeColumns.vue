<template>
  <div class="one-row-three-columns" v-if="data?.options?.list">
    <div
      v-for="(item, index) in data.options.list"
      :key="index"
      class="column-item hover-pointer"
      @click="linkTo(item.url)"
    >
      <img :src="item.img" alt="" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const props = defineProps<{
  data: any
}>()

const router = useRouter()

const linkTo = (url: string) => {
  if (url) {
    if (url.substr(0, 1) === '/') {
      router.push(url)
    } else {
      window.open(url, '_blank')
    }
  }
}
</script>

<style lang="scss" scoped>
.one-row-three-columns {
  display: flex;
  justify-content: space-between;
  gap: 10px;

  .column-item {
    flex: 1;
    img {
      width: 100%;
      height: auto;
      border-radius: 4px;
      transition: all 0.3s;
    }
    &:hover img {
      transform: scale(1.02);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
  }
}
</style>

