<template>
  <div class="seckill" v-if="data?.options">
    <div class="seckill-header">
      <div class="seckill-title">限时秒杀</div>
      <div class="seckill-countdown">距离结束还剩：{{ countdown }}</div>
    </div>
    <div class="seckill-content">
      <div
        v-for="(item, index) in data.options.list"
        :key="index"
        class="seckill-item hover-pointer"
        @click="linkTo(item.url)"
      >
        <img :src="item.img" alt="" />
        <div class="seckill-price">¥{{ item.price }}</div>
        <div class="seckill-original-price">¥{{ item.originalPrice }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps<{
  data: any
}>()

const router = useRouter()
const countdown = ref('00:00:00')
let timer: NodeJS.Timeout | null = null

onMounted(() => {
  // TODO: 从数据中获取结束时间并计算倒计时
  startCountdown()
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})

const startCountdown = () => {
  // 示例：倒计时逻辑
  timer = setInterval(() => {
    // 这里应该根据实际的结束时间计算
    countdown.value = '02:30:45'
  }, 1000)
}

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

<style lang="scss" scoped>
.seckill {
  background: #fff;
  padding: 20px;
  border-radius: 4px;

  .seckill-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    .seckill-title {
      font-size: 24px;
      font-weight: bold;
      color: $theme_color;
    }

    .seckill-countdown {
      font-size: 14px;
      color: #666;
    }
  }

  .seckill-content {
    display: flex;
    gap: 20px;
    overflow-x: auto;

    .seckill-item {
      flex-shrink: 0;
      text-align: center;
      width: 150px;

      img {
        width: 150px;
        height: 150px;
        border-radius: 4px;
      }

      .seckill-price {
        color: $theme_color;
        font-size: 20px;
        font-weight: bold;
        margin-top: 10px;
      }

      .seckill-original-price {
        color: #999;
        font-size: 12px;
        text-decoration: line-through;
      }
    }
  }
}
</style>

