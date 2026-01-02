<template>
  <div class="modify-pwd">
    <h2>修改密码</h2>
    <el-form :model="form" :rules="rules" ref="formRef" label-width="120px" style="max-width: 500px">
      <el-form-item label="原密码" prop="oldPassword">
        <el-input v-model="form.oldPassword" type="password" show-password />
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword">
        <el-input v-model="form.newPassword" type="password" show-password />
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPassword">
        <el-input v-model="form.confirmPassword" type="password" show-password />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSubmit">保存</el-button>
        <el-button @click="$router.back()">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { changePassword } from '@/api/member'
import { md5 } from '@/utils/md5'

const formRef = ref<FormInstance>()

const form = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const validateConfirm = (rule: any, value: string, callback: any) => {
  if (value !== form.newPassword) {
    callback(new Error('两次输入密码不一致'))
  } else {
    callback()
  }
}

const rules: FormRules = {
  oldPassword: [{ required: true, message: '请输入原密码', trigger: 'blur' }],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '密码不能少于6位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    { validator: validateConfirm, trigger: 'blur' }
  ]
}

const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        const res = await changePassword({
          oldPassword: md5(form.oldPassword),
          newPassword: md5(form.newPassword)
        })
        const data = res.data || res
        if (data.success) {
          ElMessage.success('修改成功，请重新登录')
          setTimeout(() => {
            // TODO: 退出登录
          }, 1500)
        } else {
          ElMessage.error(data.message || '修改失败')
        }
      } catch (error: any) {
        ElMessage.error(error.message || '修改失败')
      }
    }
  })
}
</script>

<style scoped lang="scss">
.modify-pwd {
  padding: 20px;
}
</style>

