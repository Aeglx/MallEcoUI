<template>
  <div class="goods-type-wrapper" v-if="paramData?.options">
    <div class="flex goods-type-line">
      <div class="goods-type-title">{{ paramData.options.title }}</div>
      <div class="flex goods-type-labels">
        <div
          :class="{ active: current === item.___index }"
          class="goods-type-item"
          v-for="(item, index) in paramData.options.labels"
          :key="index"
          @click="handleClickLabel(item, index)"
        >
          {{ item.label }}
        </div>
      </div>
    </div>
    <!-- 商品部分 -->
    <div class="only-goods-list flex-j-sb">
      <div
        class="only-goods-list-item hover-pointer"
        v-for="(item, index) in filteredList"
        :key="index"
        @click="linkTo(item.url)"
      >
        <div class="goods-img">
          <img :src="item.img" />
        </div>
        <div>
          <div class="goods-name wes-2">{{ item.title }}</div>
          <div class="goods-desc">{{ item.desc }}</div>
        </div>
        <div class="goods-price">¥{{ Number(item.price) }}</div>
        <!-- 查看 -->
        <div class="white-shadow">
          <div class="search">去查看</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps<{
  paramData: any
}>()

const router = useRouter()
const current = ref<any>('')

const filteredList = computed(() => {
  if (!props.paramData?.options?.list) return []
  return props.paramData.options.list.filter((item: any) => item.___index === current.value)
})

onMounted(() => {
  if (props.paramData?.options?.labels?.[0]?.___index) {
    current.value = props.paramData.options.labels[0].___index
  }
})

const handleClickLabel = (val: any, index: number) => {
  current.value = val.___index || index
}

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
.goods-type-wrapper {
  position: relative;
}

.goods-type-line {
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  .goods-type-title {
    font-size: 20px;
    font-weight: bold;
  }

  .goods-type-labels {
    gap: 20px;

    .goods-type-item {
      padding: 5px 15px;
      cursor: pointer;
      border-radius: 4px;
      transition: all 0.3s;

      &:hover,
      &.active {
        background-color: $theme_color;
        color: #fff;
      }
    }
  }
}

.only-goods-list {
  display: flex;
  flex-wrap: wrap;
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

      .white-shadow {
        opacity: 1;
      }
    }

    .goods-img {
      width: 100px;
      height: 100px;
      margin-right: 10px;

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

    .goods-price {
      position: absolute;
      bottom: 10px;
      right: 10px;
      color: $theme_color;
      font-size: 16px;
      font-weight: bold;
    }

    .white-shadow {
      width: 287px;
      height: 122px;
      border-radius: 0px 0px 10px 10px;
      opacity: 0;
      position: absolute;
      bottom: 0;
      left: 0;
      display: flex;
      justify-content: center;
      transition: 0.35s;
      align-items: center;
      background: linear-gradient(180deg, rgba(252, 252, 252, 0.58) -50%, #ffffff 99%);

      .search {
        width: 143px;
        height: 45px;
        border-radius: 22.5px;
        opacity: 1;
        font-size: 20px;
        font-weight: normal;
        line-height: 45px;
        text-align: center;
        color: #fff;
        background-color: $theme_color;
        cursor: pointer;
      }
    }
  }
}
</style>

