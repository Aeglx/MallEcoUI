<template>
  <div class="flex" v-if="data?.options?.right?.model === 'brand'">
    <div class="left-side" @click="linkTo(data.options.right.data?.image?.url)">
      <img :src="data.options.right.data?.image?.src" alt="" />
    </div>
    <div class="right-side">
      <div class="badge-box flex">
        <div class="round">
          <el-icon><ArrowRight /></el-icon>
        </div>
      </div>
      <div class="flex goods-list">
        <div
          class="goods-item flex hover-pointer"
          @click="linkTo(item.url)"
          :key="index"
          v-for="(item, index) in data.options.right.data?.list"
        >
          <div class="goods-thumbnail">
            <img :src="item.img" alt="" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ArrowRight } from '@element-plus/icons-vue'

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
  width: 330px;
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
  margin-top: 33px;
  justify-content: right;

  > .round {
    width: 17.5px;
    height: 17.5px;
    opacity: 1;
    border-radius: 50%;
    text-align: center;
    line-height: 17.5px;
    border: 0.7px solid #333333;
    margin-right: 17.5px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.goods-list {
  width: 330px;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 0 16px;
}

.goods-item {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50%;
  height: 85px;
  border-radius: 9.8px;
  opacity: 1;
  transition: 0.35s;
  background: #ffffff;
  margin-bottom: 9px;
}

.left-side {
  > img {
    width: 254px;
    height: 344px;
    border-radius: 9.8px 0px 0px 9.8px;
    opacity: 1;
    cursor: pointer;
  }
}
</style>

