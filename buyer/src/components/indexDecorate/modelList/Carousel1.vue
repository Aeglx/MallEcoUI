<template>
  <div class="model-carousel1" :style="{ background: bgColor }">
    <div class="nav-body clearfix">
      <div class="nav-side"></div>
      <div class="nav-content">
        <el-carousel :interval="4000" type="card" height="470px" @change="autoChange">
          <el-carousel-item v-for="(item, index) in data.options.list" :key="index">
            <div style="overflow: hidden">
              <img :src="item.imageUrl || item.img" width="1200" height="470" @click="linkTo(item.linkUrl || item.url)" style="cursor: pointer" />
            </div>
          </el-carousel-item>
        </el-carousel>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps<{
  data: any
}>()

const router = useRouter()
const bgColor = ref('#fff')

onMounted(() => {
  if (props.data?.options?.list?.[0]?.bgColor) {
    bgColor.value = props.data.options.list[0].bgColor
  }
})

const autoChange = (val: number) => {
  if (props.data?.options?.list?.[val]?.bgColor) {
    bgColor.value = props.data.options.list[val].bgColor
  }
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
.model-carousel1 {
  width: 100%;
  height: 470px;
  background: #fff;
}

.nav-body {
  width: 1200px;
  height: 470px;
  margin: 0px auto;
}

.nav-side {
  height: 470px;
  width: 200px;
  padding: 0px;
  color: #fff;
  line-height: 470px;
  text-align: center;
  position: absolute;
  z-index: 1;
}

.nav-content {
  width: 1200px;
  height: 470px;
  overflow: hidden;
  float: left;
  position: relative;
}

:deep(.el-carousel) {
  width: 100%;
  height: 100%;
}

:deep(.el-carousel__item) {
  text-align: center;
}
</style>

