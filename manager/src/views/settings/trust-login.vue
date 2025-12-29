<template>
  <div class="trust-login-page">
    <el-card>
      <template #header>
        <span>信任登录设置</span>
      </template>
      <el-tabs v-model="activeTab">
        <el-tab-pane label="微信登录" name="wechat">
          <el-form :model="wechatForm" label-width="150px" style="margin-top: 20px">
            <el-form-item label="是否启用">
              <el-switch v-model="wechatForm.enabled" />
            </el-form-item>
            <el-form-item label="AppID">
              <el-input v-model="wechatForm.appId" style="width: 400px" />
            </el-form-item>
            <el-form-item label="AppSecret">
              <el-input v-model="wechatForm.appSecret" type="password" show-password style="width: 400px" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleSaveWechat">保存</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="QQ登录" name="qq">
          <el-form :model="qqForm" label-width="150px" style="margin-top: 20px">
            <el-form-item label="是否启用">
              <el-switch v-model="qqForm.enabled" />
            </el-form-item>
            <el-form-item label="AppID">
              <el-input v-model="qqForm.appId" style="width: 400px" />
            </el-form-item>
            <el-form-item label="AppKey">
              <el-input v-model="qqForm.appKey" type="password" show-password style="width: 400px" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleSaveQQ">保存</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getSystemSettings, updateSystemSettings } from '@/api/setting'

const activeTab = ref('wechat')
const wechatForm = reactive({
  enabled: false,
  appId: '',
  appSecret: ''
})

const qqForm = reactive({
  enabled: false,
  appId: '',
  appKey: ''
})

const handleSaveWechat = async () => {
  try {
    const res = await updateSystemSettings({ wechatLogin: wechatForm })
    if (res.success) {
      ElMessage.success('保存成功')
    }
  } catch (error) {
    console.error('保存失败:', error)
  }
}

const handleSaveQQ = async () => {
  try {
    const res = await updateSystemSettings({ qqLogin: qqForm })
    if (res.success) {
      ElMessage.success('保存成功')
    }
  } catch (error) {
    console.error('保存失败:', error)
  }
}

const loadData = async () => {
  try {
    const res = await getSystemSettings()
    if (res.success && res.result) {
      if (res.result.wechatLogin) {
        Object.assign(wechatForm, res.result.wechatLogin)
      }
      if (res.result.qqLogin) {
        Object.assign(qqForm, res.result.qqLogin)
      }
    }
  } catch (error) {
    console.error('加载数据失败:', error)
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped lang="scss">
.trust-login-page {
  font-size: 12px;
}
</style>

