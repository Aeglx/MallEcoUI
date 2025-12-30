<template>
  <div class="new-goods" v-if="options">
    <div class="left">
      <div class="top-header" :style="{ background: options.left.bgColor }">
        <span>{{ options.left.title }}</span>
        <span @click="linkTo(options.left.url)" class="hover-pointer">
          {{ options.left.secondTitle }} &gt;
        </span>
      </div>
      <div class="content">
        <div
          class="con-item hover-pointer"
          v-for="(item, index) in options.left.list"
          :key="index"
          @click="linkTo(item.url)"
        >
          <div>
            <p>{{ item.name }}</p>
            <p class="describe">{{ item.describe }}</p>
          </div>
          <img :src="item.img" alt="" />
        </div>
      </div>
    </div>

    <div class="middle">
      <div class="top-header" :style="{ background: options.middle.bgColor }">
        <span>{{ options.middle.title }}</span>
        <span class="hover-pointer" @click="linkTo(options.middle.url)">
          {{ options.middle.secondTitle }} &gt;
        </span>
      </div>
      <div class="content">
        <div
          class="con-item hover-pointer"
          v-for="(item, index) in options.middle.list"
          :key="index"
          @click="linkTo(item.url)"
        >
          <div>
            <p>{{ item.name }}</p>
            <p class="describe">{{ item.describe }}</p>
          </div>
          <img :src="item.img" alt="" />
        </div>
      </div>
    </div>

    <div class="right">
      <div class="top-header" :style="{ background: options.right.bgColor }">
        <span>{{ options.right.title }}</span>
        <span @click="linkTo(options.right.url)" class="hover-pointer">
          {{ options.right.secondTitle }} &gt;
        </span>
      </div>
      <div class="content">
        <div
          v-for="(item, index) in options.right.list"
          :key="index"
          class="hover-pointer"
          @click="linkTo(item.url)"
        >
          <img :src="item.img" alt="" />
          <p>{{ item.name }}</p>
          <p class="price">¥{{ item.price }}</p>
          <div class="jiaobiao" :class="'jiaobiao' + ((index % 3) + 1)">
            {{ index + 1 }}
          </div>
        </div>
      </div>
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
.new-goods {
  display: flex;
  justify-content: space-between;
  > div {
    width: 393px;
    height: 440px;
  }

  .left > .content {
    > div:nth-child(1) {
      height: 240px;
      flex-direction: column;
      border: 1px solid #eee;
      border-top: none;
      border-left: none;
      justify-content: space-between;
      img {
        width: 160px;
        height: 160px;
      }
      .describe {
        margin-top: 10px;
      }
    }
    > div:nth-child(2) {
      border-right: 1px solid #eee;
    }
    > div:nth-child(3),
    > div:nth-child(4) {
      border-bottom: 1px solid #eee;
    }
  }

  .middle > .content {
    > div {
      border-style: solid;
      border-color: #eee;
      border-width: 0;
      border-bottom-width: 1px;
    }
    > div:nth-child(1),
    > div:nth-child(2),
    > div:nth-child(3) {
      border-right-width: 1px;
    }
    > div:nth-child(6),
    > div:nth-child(3) {
      border-bottom-width: 0;
    }
  }

  .right > .content {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    font-size: 12px;
    > div {
      position: relative;
      width: 120px;
      padding: 5px 10px 0 10px;
      img {
        width: 100px;
        height: 100px;
      }
      border-bottom: 1px solid #eee;
      p:nth-child(2) {
        height: 38px;
        overflow: hidden;
      }
      .price {
        color: $theme_color;
        margin-top: 5px;
      }
      .jiaobiao {
        position: absolute;
        width: 23px;
        height: 23px;
        top: 10px;
        right: 16px;
        background: #f31947;
        color: #fff;
        text-align: center;
        line-height: 23px;
        border-radius: 50%;
        font-size: 12px;
      }
    }
    > div:nth-child(4),
    > div:nth-child(5),
    > div:nth-child(6) {
      border: none;
    }
  }

  .top-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 50px;
    padding: 0 10px;
    background: #c43d7e;
    color: #fff;
    span:nth-child(1) {
      font-size: 20px;
    }
    span:nth-child(2) {
      font-size: 12px;
    }
  }
  .content {
    padding: 10px 12px 0;
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    height: 370px;
  }
  .con-item {
    width: 185px;
    height: 120px;
    display: flex;
    padding-left: 10px;
    padding-top: 10px;
    img {
      width: 90px;
      height: 90px;
      margin-top: 10px;
    }
  }
  .describe {
    color: #999;
    font-size: 12px;
    margin-top: 15px;
  }
}
</style>

