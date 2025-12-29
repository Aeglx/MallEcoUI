<template>
  <div>
    <el-drawer v-model="drawer" title="页面配置" size="300px">
      <!-- 内容 -->
      <h3>内容设置</h3>
      <div class="config-item flex flex-a-c flex-j-sb">
        <div>
          <el-tooltip
            effect="light"
            placement="bottom-end"
            :max-width="100"
            content="关闭之后部分页面点击'查看''详情'等按钮将跳到新页面展示"
          >
            <div>多标签Tab页内嵌模式</div>
          </el-tooltip>
        </div>
        <el-switch v-model="setting.isUseTabsRouter"></el-switch>
      </div>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useSettingStore } from '@/stores/setting'
import { setStore } from '@/libs/storage'

const settingStore = useSettingStore()
const drawer = ref(false)

const setting = ref(settingStore.setting)

const open = () => {
  drawer.value = true
}

const close = () => {
  drawer.value = false
}

watch(
  () => setting.value,
  (val) => {
    setStore('admin-setting', val)
    settingStore.updateSetting(val)
  },
  { deep: true }
)

defineExpose({
  open,
  close
})
</script>

<style lang="scss" scoped>
.config-item {
  margin: 20px 0;
}
</style>

