<template>
  <div class="profile">
    <h2>用户信息</h2>
    <el-form :model="form" label-width="120px" style="max-width: 600px">
      <el-form-item label="用户名">
        <el-input v-model="form.username" disabled />
      </el-form-item>
      <el-form-item label="昵称">
        <el-input v-model="form.nickName" />
      </el-form-item>
      <el-form-item label="头像">
        <el-upload
          class="avatar-uploader"
          action="#"
          :show-file-list="false"
          :before-upload="beforeUpload"
        >
          <el-avatar v-if="form.face" :src="form.face" :size="100" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSubmit">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { getMemberInfo, updateMemberInfo } from '@/api/member'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

const form = reactive({
  username: '',
  nickName: '',
  face: ''
})

const beforeUpload = (file: File) => {
  // TODO: 上传头像
  ElMessage.info('头像上传功能待开发')
  return false
}

const getInfo = async () => {
  try {
    const res = await getMemberInfo()
    const data = res.data || res
    if (data.success && data.result) {
      Object.assign(form, data.result)
    }
  } catch (error) {
    console.error('获取用户信息失败:', error)
  }
}

const handleSubmit = async () => {
  try {
    const res = await updateMemberInfo(form)
    const data = res.data || res
    if (data.success) {
      ElMessage.success('保存成功')
      await userStore.fetchUserInfo()
    }
  } catch (error: any) {
    ElMessage.error(error.message || '保存失败')
  }
}

onMounted(() => {
  getInfo()
})
</script>

<style scoped lang="scss">
.profile {
  padding: 20px;
}

.avatar-uploader {
  :deep(.el-upload) {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;

    &:hover {
      border-color: #f31947;
    }
  }
}
</style>

