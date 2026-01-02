<template>
  <div class="verify-content" v-if="show" @mousemove="mouseMove" @mouseup="mouseUp" @click.stop>
    <div class="imgBox" :style="{ width: data.originalWidth + 'px', height: data.originalHeight + 'px' }">
      <img :src="data.backImage" style="width: 100%; height: 100%" alt="" />
      <img
        class="slider"
        :src="data.slidingImage"
        :style="{ left: distance + 'px', top: data.randomY + 'px' }"
        :width="data.sliderWidth"
        :height="data.sliderHeight"
        alt=""
      />
      <el-icon class="refresh" @click="init">
        <Refresh />
      </el-icon>
    </div>
    <div class="handle" :style="{ width: data.originalWidth + 'px' }">
      <span class="bgcolor" :style="{ width: distance + 'px', background: bgColor }"></span>
      <span class="swiper" :style="{ left: distance + 'px' }" @mousedown="mouseDown">
        <el-icon>
          <ArrowRight />
        </el-icon>
      </span>
      <span class="text">{{ verifyText }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Refresh, ArrowRight } from '@element-plus/icons-vue'
import { getVerifyImg, postVerifyImg } from './verify'

const props = defineProps<{
  verifyType?: string
}>()

const emit = defineEmits<{
  change: [value: { status: boolean; data?: any }]
}>()

const show = ref(false)
const type = ref(props.verifyType || 'LOGIN')
const data = ref({
  backImage: '',
  slidingImage: '',
  originalHeight: 150,
  originalWidth: 300,
  sliderWidth: 60,
  sliderHeight: 60,
  randomX: 0,
  randomY: 0
})
const distance = ref(0)
const flag = ref(false)
const downX = ref(0)
const bgColor = ref('#04ad11')
const verifyText = ref('拖动滑块解锁')

const init = async () => {
  show.value = true
  distance.value = 0
  flag.value = false
  bgColor.value = '#04ad11'
  verifyText.value = '拖动滑块解锁'

  try {
    const res = await getVerifyImg(type.value)
    const result = res.data || res
    if (result.success && result.result) {
      data.value = result.result
    } else {
      console.error('获取验证码失败:', result.message || '未知错误')
      verifyText.value = '获取验证码失败，请重试'
    }
  } catch (error: any) {
    console.error('获取验证码失败', error)
    verifyText.value = '获取验证码失败，请重试'
    if (error?.code === 'ERR_NETWORK' || error?.message?.includes('CONNECTION_REFUSED')) {
      console.error('后端服务未启动，请启动后端服务')
    }
  }
}

const mouseDown = (e: MouseEvent) => {
  downX.value = e.clientX
  flag.value = true
}

const mouseMove = (e: MouseEvent) => {
  if (!flag.value) return

  const offset = e.clientX - downX.value
  const maxDistance = data.value.originalWidth - 43

  if (offset > maxDistance) {
    distance.value = maxDistance
  } else if (offset < 0) {
    distance.value = 0
  } else {
    distance.value = offset
  }
}

const mouseUp = async () => {
  if (!flag.value) return
  flag.value = false

  try {
    const res = await postVerifyImg({
      x: distance.value,
      y: data.value.randomY,
      type: type.value,
      verificationEnums: type.value
    })
    const result = res.data || res

    if (result.success) {
      if (result.result) {
        bgColor.value = '#04ad11'
        verifyText.value = '验证成功'
        emit('change', { status: true, data: result.result })
        setTimeout(() => {
          show.value = false
        }, 1000)
      } else {
        bgColor.value = '#ed4014'
        verifyText.value = '验证失败，请重试'
        emit('change', { status: false })
        setTimeout(() => {
          init()
        }, 1000)
      }
    } else {
      bgColor.value = '#ed4014'
      verifyText.value = result.message || '验证失败'
      emit('change', { status: false })
      setTimeout(() => {
        init()
      }, 1000)
    }
  } catch (error: any) {
    console.error('验证失败', error)
    bgColor.value = '#ed4014'
    verifyText.value = '验证失败，请重试'
    emit('change', { status: false })
    setTimeout(() => {
      init()
    }, 1000)
  }
}

const reset = () => {
  show.value = false
  distance.value = 0
  emit('change', { status: false })
}

defineExpose({
  init,
  show,
  reset
})
</script>

<style lang="scss" scoped>
.verify-content {
  position: relative;
  padding: 20px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);

  .imgBox {
    position: relative;
    margin-bottom: 10px;
    overflow: hidden;

    .slider {
      position: absolute;
      cursor: pointer;
    }

    .refresh {
      position: absolute;
      top: 5px;
      right: 5px;
      cursor: pointer;
      font-size: 20px;
      color: #666;
      z-index: 10;
    }
  }

  .handle {
    position: relative;
    height: 40px;
    line-height: 40px;
    background: #f7f9fa;
    border-radius: 4px;
    text-align: center;

    .bgcolor {
      position: absolute;
      left: 0;
      top: 0;
      height: 40px;
      opacity: 0.5;
    }

    .swiper {
      position: absolute;
      width: 40px;
      height: 40px;
      background-color: #fff;
      border-radius: 4px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      z-index: 2;
    }

    .text {
      display: inline-block;
      width: 100%;
      text-align: center;
      line-height: 40px;
      font-size: 14px;
      user-select: none;
      z-index: 1;
    }
  }
}
</style>

