<template>
  <div class="payment-page">
    <el-card>
      <template #header>
        <span>支付设置</span>
      </template>
      <el-tabs v-model="activeTab">
        <el-tab-pane label="支付宝" name="alipay">
          <el-form :model="alipayForm" label-width="150px" style="margin-top: 20px">
            <el-form-item label="是否启用">
              <el-switch v-model="alipayForm.enabled" />
            </el-form-item>
            <el-form-item label="应用ID">
              <el-input v-model="alipayForm.appId" style="width: 400px" />
            </el-form-item>
            <el-form-item label="应用私钥">
              <el-input v-model="alipayForm.privateKey" type="textarea" :rows="4" style="width: 400px" />
            </el-form-item>
            <el-form-item label="支付宝公钥">
              <el-input v-model="alipayForm.publicKey" type="textarea" :rows="4" style="width: 400px" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleSaveAlipay">保存</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="微信支付" name="wechat">
          <el-form :model="wechatForm" label-width="150px" style="margin-top: 20px">
            <el-form-item label="是否启用">
              <el-switch v-model="wechatForm.enabled" />
            </el-form-item>
            <el-form-item label="商户号">
              <el-input v-model="wechatForm.mchId" style="width: 400px" />
            </el-form-item>
            <el-form-item label="AppID">
              <el-input v-model="wechatForm.appId" style="width: 400px" />
            </el-form-item>
            <el-form-item label="API密钥">
              <el-input v-model="wechatForm.apiKey" type="password" show-password style="width: 400px" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleSaveWechat">保存</el-button>
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
import { getPaymentSettings, updatePaymentSettings } from '@/api/setting'

const activeTab = ref('alipay')
const alipayForm = reactive({
  enabled: false,
  appId: '',
  privateKey: '',
  publicKey: ''
})

const wechatForm = reactive({
  enabled: false,
  mchId: '',
  appId: '',
  apiKey: ''
})

const handleSaveAlipay = async () => {
  try {
    const res = await updatePaymentSettings({ alipay: alipayForm })
    if (res.success) {
      ElMessage.success('保存成功')
    }
  } catch (error) {
    console.error('保存失败:', error)
  }
}

const handleSaveWechat = async () => {
  try {
    const res = await updatePaymentSettings({ wechat: wechatForm })
    if (res.success) {
      ElMessage.success('保存成功')
    }
  } catch (error) {
    console.error('保存失败:', error)
  }
}

const loadData = async () => {
  try {
    const res = await getPaymentSettings()
    if (res.success && res.result) {
      if (res.result.alipay) {
        Object.assign(alipayForm, res.result.alipay)
      }
      if (res.result.wechat) {
        Object.assign(wechatForm, res.result.wechat)
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
.payment-page {
  font-size: 12px;
}
</style>

