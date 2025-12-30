<template>
  <div class="flex" v-if="data?.options?.left?.model === 'goods'">
    <div class="left-side" @click="linkTo(data.options.left.data?.image?.url)">
      <img :src="data.options.left.data?.image?.src" alt="" />
    </div>
    <div class="right-side">
      <div class="badge-box flex">
        <div class="badge" @click="linkTo(data.options.left.data?.image?.url)">
          {{ data.options.left.data?.badge?.label }}
        </div>
      </div>
      <div class="flex goods-list">
        <div
          class="goods-item flex hover-pointer"
          @click="linkTo(item.url)"
          :key="index"
          v-for="(item, index) in data.options.left.data?.list"
        >
          <div class="goods-thumbnail">
            <img :src="item.img" alt="" />
          </div>
          <div class="goods-detail">
            <div class="goods-detail-title">{{ item.title }}</div>
            <div class="goods-detail-price">¥{{ Number(item.price) }}</div>
          </div>
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
  if (url) {
    if (url.substr(0, 1) === '/') {
      router.push(url)
    } else {
      window.open(url, '_blank')
    }
  }
}
</script>

<style scoped lang="scss">
.right-side {
  width: 387px;
}

.goods-detail-title {
  font-size: 13px;
  font-weight: normal;
  line-height: 16px;
  text-align: center;
  letter-spacing: 0px;
  color: #333333;
}

.goods-detail-price {
  font-size: 14px;
  font-weight: normal;
  line-height: 17px;
  letter-spacing: 0px;
  color: $theme_color;
  margin-top: 8px;
  margin-bottom: 10px;
}

.goods-thumbnail {
  margin-left: 7px;
  display: flex;
  align-items: center;

  > img {
    width: 90px;
    height: 90px;
  }
}

.badge-box {
  justify-content: right;
}

.goods-list {
  width: 387px;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 0 16px;
}

.goods-item {
  cursor: pointer;
  display: flex;
  align-items: center;
  width: 173.6px;
  height: 119px;
  border-radius: 9.8px;
  opacity: 1;
  transition: 0.35s;
  background: #ffffff;
  margin-bottom: 9px;

  &:hover {
    box-shadow: 0px 1px 6px 0px #e5e5e5;
  }
}

.left-side {
  > img {
    border-radius: 10px 0px 0px 10px;
    display: block;
    width: 196.7px;
    height: 343.7px;
  }
}

.badge {
  width: 50px;
  height: 27px;
  line-height: 27px;
  border-radius: 13.3px 0px 0px 13.3px;
  opacity: 1;
  background: #f31947;
  font-size: 12.6px;
  font-weight: normal;
  text-align: center;
  letter-spacing: 0px;
  color: #ffffff;
  margin-top: 26px;
  margin-bottom: 17px;
  cursor: pointer;
}
</style>

