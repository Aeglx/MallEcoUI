<template>
  <div class="model-item" v-if="element && element.key">
    <!-- 轮播图模块1 -->
    <ModelCarousel1
      v-if="element.type === 'carousel1'"
      :data="element"
      class="mb_20"
    />

    <!-- 轮播图模块 -->
    <ModelCarousel
      v-if="element.type === 'carousel'"
      :data="element"
      class="mb_20 width_1200_auto"
    />

    <!-- 轮播图模块2 -->
    <ModelCarousel2
      v-if="element.type === 'carousel2'"
      :data="element"
      class="mb_20 width_1200_auto"
    />

    <!-- 热门广告 -->
    <div v-if="element.type === 'hotAdvert'" class="mb_20 width_1200_auto">
      <img
        style="display: block"
        class="hover-pointer"
        :src="element.options.list[0].img"
        @click="linkTo(element.options.list[0].url)"
        width="1200"
        alt=""
      />
      <ul class="advert-list width_1200_auto">
        <template v-for="(item, index) in element.options.list" :key="index">
          <li
            v-if="index !== 0"
            @click="linkTo(item.url)"
            class="hover-pointer"
          >
            <img :src="item.img" width="230" height="190" alt="" />
          </li>
        </template>
      </ul>
    </div>

    <!-- 限时秒杀 -->
    <Seckill
      v-if="element.type === 'seckill' && element.options.list.length"
      :data="element"
      class="mb_20 width_1200_auto"
    />

    <!-- 折扣广告 -->
    <div v-if="element.type === 'discountAdvert'" class="discountAdvert">
      <img
        v-for="(item, index) in element.options.classification"
        :key="index"
        @click="linkTo(item.url)"
        class="hover-pointer"
        :src="item.img"
        width="190"
        height="210"
        alt=""
      />
      <img
        v-for="(item, index) in element.options.brandList"
        :key="'discount' + index"
        @click="linkTo(item.url)"
        class="hover-pointer"
        :src="item.img"
        width="240"
        height="105"
        alt=""
      />
    </div>

    <!-- 好货推荐 -->
    <Recommend
      v-if="element.type === 'recommend'"
      :data="element"
      class="mb_20 width_1200_auto"
    />

    <!-- 一行三列 -->
    <OneRowThreeColumns
      v-if="element.type === 'oneRowThreeColumns'"
      :data="element"
      class="mb_20 width_1200_auto"
    />

    <!-- 商品模块 -->
    <GoodsAndType
      v-if="element.type === 'goodsType'"
      :paramData="element"
      class="mb_20 width_1200_auto"
    />

    <!-- 商品模块 -->
    <OnlyGoodsModel
      v-if="element.type === 'onlyGoodsModel'"
      :data="element"
      class="mb_20 width_1200_auto"
    />

    <!-- 混合模块 -->
    <MixModel
      v-if="element.type === 'mixModel'"
      :data="element"
      class="mb_20 width_1200_auto"
    />

    <!-- 为你推荐 -->
    <ForYour
      v-if="element.type === 'forYour'"
      :data="element"
      class="mb_20 width_1200_auto"
    />

    <!-- 新品排行 -->
    <NewGoodsSort
      v-if="element.type === 'newGoodsSort'"
      :data="element"
      class="mb_20 width_1200_auto"
    />

    <!-- 首页广告 -->
    <FirstPageAdvert
      v-if="element.type === 'firstAdvert'"
      :data="element"
      class="mb_20 width_1200_auto"
    />

    <!-- 横幅广告 -->
    <div v-if="element.type === 'bannerAdvert'" style="width: 100%; text-align: center">
      <img
        width="1200"
        class="hover-pointer mb_20 bannerAd"
        @click="linkTo(element.options.url)"
        :src="element.options.img"
        alt=""
      />
    </div>

    <!-- 补货中 -->
    <NotEnough
      v-if="element.type === 'notEnough'"
      :data="element"
      class="mb_20 width_1200_auto"
    />
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import { useRouter } from 'vue-router'
import ModelCarousel from './modelList/Carousel.vue'
import ModelCarousel1 from './modelList/Carousel1.vue'
import ModelCarousel2 from './modelList/Carousel2.vue'
import FirstPageAdvert from './modelList/FirstPageAdvert.vue'
import NewGoodsSort from './modelList/NewGoodsSort.vue'
import Recommend from './modelList/Recommend.vue'
import NotEnough from './modelList/NotEnough.vue'
import Seckill from './modelList/Seckill.vue'
import OneRowThreeColumns from './modelList/OneRowThreeColumns.vue'
import GoodsAndType from './modelList/GoodsAndType.vue'
import OnlyGoodsModel from './modelList/OnlyGoodsModel.vue'
import MixModel from './modelList/MixModel.vue'
import ForYour from './modelList/ForYour.vue'

const props = defineProps<{
  element: any
}>()

const router = useRouter()

const linkTo = (url: string) => {
  if (url && typeof url === 'string') {
    if (url.startsWith('/')) {
      // 内部路由
      router.push(url)
    } else if (url.startsWith('http://') || url.startsWith('https://')) {
      // 外部链接
      window.open(url, '_blank')
    } else {
      // 其他情况，尝试作为路由处理
      router.push(url)
    }
  }
}
</script>

<style lang="scss" scoped>
.model-item {
  position: relative;
  margin-bottom: 10px;
}

.bannerAd {
  width: 1183px;
  height: 166.6px;
  border-radius: 10px;
}

/** 热门广告 */
.advert-list {
  background: $theme_color;
  height: 200px;
  display: flex;
  justify-content: space-around;
  padding: 3px 10px;
  > li {
    img {
      cursor: pointer;
      border-radius: 10px;
      transition: all 150ms ease-in-out;
      &:hover {
        transform: translateY(-3px);
        box-shadow: rgba(0, 0, 0, 0.4) 0px 5px 20px 0px;
      }
    }
  }
}

/** 折扣广告 */
.discountAdvert {
  width: 1300px;
  height: 566px;
  margin: 0 auto;
  margin-bottom: 20px;
  background-repeat: no-repeat;
  position: relative;
  left: -47px;
  padding-left: 295px;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  img {
    margin-top: 10px;
    margin-right: 10px;
    transition: all 150ms ease-in-out;
    &:hover {
      box-shadow: 0 5px 12px 0 rgba(0, 0, 0, 0.4);
      transform: translateY(-2px);
    }
  }
}
</style>

