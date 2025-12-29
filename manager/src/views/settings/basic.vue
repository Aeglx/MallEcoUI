<template>
  <div class="basic-page">
    <el-card>
      <template #header>
        <span>系统设置</span>
      </template>
      <el-form :model="formData" :rules="rules" ref="formRef" label-width="150px">
        <el-form-item label="站点名称" prop="siteName">
          <el-input v-model="formData.siteName" style="width: 400px" />
        </el-form-item>
        <el-form-item label="站点地址" prop="staticPageAddress">
          <el-input v-model="formData.staticPageAddress" style="width: 400px" />
        </el-form-item>
        <el-form-item label="WAP站点地址" prop="staticPageWapAddress">
          <el-input v-model="formData.staticPageWapAddress" style="width: 400px" />
        </el-form-item>
        <el-form-item label="买家端Logo" prop="buyerSideLogo">
          <div class="upload-item">
            <el-image
              v-if="formData.buyerSideLogo"
              :src="formData.buyerSideLogo"
              style="width: 100px; height: 100px; margin-right: 10px"
              fit="cover"
            />
            <el-button @click="handleSelectImage('buyerSideLogo')">选择图片</el-button>
            <span class="desc">买家端logo展示 17:6</span>
          </div>
        </el-form-item>
        <el-form-item label="买家端Icon" prop="buyerSideIcon">
          <div class="upload-item">
            <el-image
              v-if="formData.buyerSideIcon"
              :src="formData.buyerSideIcon"
              style="width: 100px; height: 100px; margin-right: 10px"
              fit="cover"
            />
            <el-button @click="handleSelectImage('buyerSideIcon')">选择图片</el-button>
            <span class="desc">买家端网站icon展示 1:1</span>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSubmit">保存</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getSystemSettings, updateSystemSettings } from '@/api/setting'

const formRef = ref()
const formData = reactive({
  siteName: '',
  staticPageAddress: '',
  staticPageWapAddress: '',
  buyerSideLogo: '',
  buyerSideIcon: ''
})

const rules = {
  siteName: [{ required: true, message: '请输入站点名称', trigger: 'blur' }],
  staticPageAddress: [{ required: true, message: '请输入站点地址', trigger: 'blur' }]
}

const handleSelectImage = (field: string) => {
  console.log('选择图片:', field)
  // TODO: 打开图片选择器
}

const handleSubmit = async () => {
  try {
    await formRef.value.validate()
    const res = await updateSystemSettings(formData)
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
      Object.assign(formData, res.result)
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
.basic-page {
  font-size: 12px;
  .upload-item {
    display: flex;
    align-items: center;
    .desc {
      margin-left: 10px;
      color: #999;
      font-size: 12px;
    }
  }
}
</style>

