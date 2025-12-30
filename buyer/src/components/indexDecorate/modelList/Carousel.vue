<template>
  <div class="model-carousel">
    <el-carousel :interval="4000" height="400px">
      <el-carousel-item v-for="(item, index) in data?.options?.list" :key="index">
        <img :src="item.img || item.imageUrl" width="100%" height="100%" @click="linkTo(item.url || item.linkUrl)" style="cursor: pointer" />
      </el-carousel-item>
    </el-carousel>
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
.model-carousel {
  width: 100%;
  border-radius: 4px;
  overflow: hidden;
}
</style>

