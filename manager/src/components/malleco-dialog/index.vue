<template>
  <el-dialog
    :model-value="flag"
    @update:model-value="(val) => (flag = val)"
    title="选择"
    width="1160px"
    :close-on-click-modal="false"
    :z-index="10000"
    @close="clickClose"
  >
    <template v-if="flag">
      <GoodsDialog
        @selected="
          (val) => {
            goodsData = val
          }
        "
        v-if="goodsFlag"
        ref="goodsDialogRef"
        :selectedWay="goodsData"
      />
      <LinkDialog
        @selectedLink="
          (val) => {
            linkData = val
          }
        "
        v-else
        class="linkDialog"
      />
    </template>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="clickClose">取消</el-button>
        <el-button type="primary" @click="clickOK">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import GoodsDialog from './goods-dialog.vue'
import LinkDialog from './link-dialog.vue'

const emit = defineEmits<{
  selectedGoodsData: [data: any[]]
  selectedLink: [link: string]
  closeFlag: [flag: boolean]
}>()

const goodsDialogRef = ref()
const goodsFlag = ref(false) // 是否商品选择器
const goodsData = ref<any[]>([]) // 选择的商品
const linkData = ref('') // 选择的链接
const flag = ref(false) // modal显隐

const clearGoodsSelected = () => {
  goodsData.value = []
}

// 关闭弹窗
const clickClose = () => {
  flag.value = false
  emit('closeFlag', false)
  goodsFlag.value = false
}

// 单选商品
const singleGoods = () => {
  const timer = setInterval(() => {
    if (goodsDialogRef.value) {
      ;(goodsDialogRef.value as any).type = 'single'
      clearInterval(timer)
    }
  }, 100)
}

// 点击确认
const clickOK = () => {
  if (goodsFlag.value) {
    emit('selectedGoodsData', goodsData.value)
  } else {
    emit('selectedLink', linkData.value)
  }
  clickClose()
}

// 打开组件方法
const open = (type: string, mutiple?: boolean) => {
  flag.value = true
  if (type === 'goods') {
    goodsFlag.value = true
    if (mutiple) {
      singleGoods()
    }
  } else {
    goodsFlag.value = false
  }
}

// 关闭组件
const close = () => {
  flag.value = false
}

defineExpose({
  open,
  close,
  clearGoodsSelected
})
</script>

<style scoped lang="scss">
:deep(.el-dialog__body) {
  max-height: 500px;
  overflow-y: auto;
}
</style>

