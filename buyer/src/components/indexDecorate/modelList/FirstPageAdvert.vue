<template>
  <div class="first-page-advert" v-if="options?.list">
    <div
      class="item hover-pointer"
      @click="linkTo(item.url)"
      :style="{
        backgroundImage: `linear-gradient(to right, ${item.fromColor || '#ccc'}, ${item.toColor || '#999'})`,
      }"
      v-for="(item, index) in options.list"
      :key="index"
    >
      <div>
        <span class="line top-line"></span>
        <p>{{ item.name }}</p>
        <span class="line btm-line"></span>
        <p>{{ item.describe }}</p>
      </div>
      <img :src="item.img" width="170" height="170" alt="" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps<{
  data: any
}>()

const router = useRouter()

const options = computed(() => props.data?.options)

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
.first-page-advert {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;

  .item {
    width: 393px;
    height: 170px;
    margin-top: 10px;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      margin-left: 20px;
      transition: transform 0.5s, -webkit-transform 0.5s, -moz-transform 0.5s;

      &:hover {
        transform: translateX(-5px);
      }
    }

    &:nth-of-type(1),
    &:nth-of-type(2),
    &:nth-of-type(3) {
      margin-top: 0;
    }

    p:nth-of-type(1) {
      margin: 3px 0;
      font-size: 18px;
      color: #fff;
    }

    p:nth-of-type(2) {
      margin-top: 3px;
      color: #fff;
    }
  }

  .line {
    position: relative;
    display: block;
    height: 2px;
    background: $theme_color;
    z-index: 1;
  }

  .top-line {
    width: 78px;
  }

  .btm-line {
    width: 154px;
  }
}
</style>

