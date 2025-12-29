<template>
  <div class="oss-page">
    <el-card>
      <template #header>
        <span>OSS资源配置</span>
      </template>
      <el-form :model="formData" :rules="rules" ref="formRef" label-width="150px">
        <el-form-item label="平台" prop="type">
          <el-radio-group v-model="formData.type">
            <el-radio label="ALI_OSS">阿里OSS</el-radio>
            <el-radio label="MINIO">MINIO</el-radio>
            <el-radio label="HUAWEI_OBS">华为云OBS</el-radio>
            <el-radio label="TENCENT_COS">腾讯云COS</el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- 阿里OSS -->
        <template v-if="formData.type === 'ALI_OSS'">
          <el-form-item label="节点" prop="aliyunOSSEndPoint">
            <el-input v-model="formData.aliyunOSSEndPoint" style="width: 400px" />
          </el-form-item>
          <el-form-item label="储存空间" prop="aliyunOSSBucketName">
            <el-input v-model="formData.aliyunOSSBucketName" style="width: 400px" />
          </el-form-item>
          <el-form-item label="密钥ID" prop="aliyunOSSAccessKeyId">
            <el-input v-model="formData.aliyunOSSAccessKeyId" style="width: 400px" />
          </el-form-item>
          <el-form-item label="密钥" prop="aliyunOSSAccessKeySecret">
            <el-input v-model="formData.aliyunOSSAccessKeySecret" type="password" show-password style="width: 400px" />
          </el-form-item>
        </template>

        <!-- MINIO -->
        <template v-if="formData.type === 'MINIO'">
          <el-form-item label="访问地址" prop="m_frontUrl">
            <el-input v-model="formData.m_frontUrl" style="width: 400px" />
            <div class="desc">配置MINIO nginx前端访问转发地址，一般为完整域名</div>
          </el-form-item>
          <el-form-item label="Endpoint" prop="m_endpoint">
            <el-input v-model="formData.m_endpoint" style="width: 400px" />
          </el-form-item>
          <el-form-item label="AccessKey" prop="m_accessKey">
            <el-input v-model="formData.m_accessKey" style="width: 400px" />
          </el-form-item>
          <el-form-item label="SecretKey" prop="m_secretKey">
            <el-input v-model="formData.m_secretKey" type="password" show-password style="width: 400px" />
          </el-form-item>
          <el-form-item label="Bucket名称" prop="m_bucketName">
            <el-input v-model="formData.m_bucketName" style="width: 400px" />
          </el-form-item>
        </template>

        <!-- 华为云OBS -->
        <template v-if="formData.type === 'HUAWEI_OBS'">
          <el-form-item label="AccessKey" prop="huaweicloudOBSAccessKey">
            <el-input v-model="formData.huaweicloudOBSAccessKey" style="width: 400px" />
          </el-form-item>
          <el-form-item label="SecretKey" prop="huaweicloudOBSSecretKey">
            <el-input v-model="formData.huaweicloudOBSSecretKey" type="password" show-password style="width: 400px" />
          </el-form-item>
          <el-form-item label="Endpoint" prop="huaweicloudOBSEndPoint">
            <el-input v-model="formData.huaweicloudOBSEndPoint" style="width: 400px" />
          </el-form-item>
          <el-form-item label="Bucket名称" prop="huaweicloudOBSBucketName">
            <el-input v-model="formData.huaweicloudOBSBucketName" style="width: 400px" />
          </el-form-item>
        </template>

        <!-- 腾讯云COS -->
        <template v-if="formData.type === 'TENCENT_COS'">
          <el-form-item label="SecretId" prop="tencentCOSSecretId">
            <el-input v-model="formData.tencentCOSSecretId" style="width: 400px" />
          </el-form-item>
          <el-form-item label="SecretKey" prop="tencentCOSSecretKey">
            <el-input v-model="formData.tencentCOSSecretKey" type="password" show-password style="width: 400px" />
          </el-form-item>
          <el-form-item label="地域" prop="tencentCOSRegion">
            <el-input v-model="formData.tencentCOSRegion" style="width: 400px" />
          </el-form-item>
          <el-form-item label="Bucket" prop="tencentCOSBucket">
            <el-input v-model="formData.tencentCOSBucket" style="width: 400px" />
          </el-form-item>
          <el-form-item label="Endpoint" prop="tencentCOSEndPoint">
            <el-input v-model="formData.tencentCOSEndPoint" style="width: 400px" />
          </el-form-item>
        </template>

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
  type: 'ALI_OSS',
  aliyunOSSEndPoint: '',
  aliyunOSSBucketName: '',
  aliyunOSSAccessKeyId: '',
  aliyunOSSAccessKeySecret: '',
  m_frontUrl: '',
  m_endpoint: '',
  m_accessKey: '',
  m_secretKey: '',
  m_bucketName: '',
  huaweicloudOBSAccessKey: '',
  huaweicloudOBSSecretKey: '',
  huaweicloudOBSEndPoint: '',
  huaweicloudOBSBucketName: '',
  tencentCOSSecretId: '',
  tencentCOSSecretKey: '',
  tencentCOSRegion: '',
  tencentCOSBucket: '',
  tencentCOSEndPoint: ''
})

const rules = {
  type: [{ required: true, message: '请选择平台', trigger: 'change' }]
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
.oss-page {
  font-size: 12px;
  .desc {
    color: #999;
    font-size: 12px;
    margin-left: 10px;
  }
}
</style>

