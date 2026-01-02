<template>
  <div class="goods-type-wrapper" v-if="data?.options">
    <!-- 商品部分 -->
    <div class="only-goods-list flex">
      <div
        class="only-goods-list-item hover-pointer"
        v-for="(item, index) in data.options.list"
        :key="index"
        @click="linkTo(item.url)"
      >
        <div>
          <div class="goods-name wes-2">{{ item.title }}</div>
          <div class="goods-desc">{{ item.desc }}</div>
        </div>
        <div class="goods-img">
          <img :src="item.img" />
        </div>
      </div>
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
  if (url && typeof url === 'string') {
    if (url.startsWith('/')) {
      router.push(url)
    } else if (url.startsWith('http://') || url.startsWith('https://')) {
      window.open(url, '_blank')
    } else {
      router.push(url)
    }
  }
}
</script>

<style scoped lang="scss">
.goods-type-wrapper {
  position: relative;
}

.only-goods-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 10px;

  .only-goods-list-item {
    position: relative;
    width: 287px;
    height: 122px;
    border: 1px solid #eee;
    border-radius: 10px;
    padding: 10px;
    display: flex;
    align-items: center;
    transition: all 0.3s;

    &:hover {
      border-color: $theme_color;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .goods-img {
      width: 100px;
      height: 100px;
      margin-left: 10px;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 4px;
      }
    }

    .goods-name {
      font-size: 14px;
      font-weight: bold;
      margin-bottom: 5px;
    }

    .goods-desc {
      font-size: 12px;
      color: #999;
    }
  }
}
</style>

