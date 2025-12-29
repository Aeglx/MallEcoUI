<template>
  <div>
    <Card class="change-pass">
      <template #title>修改密码</template>
      <div class="mt_10">
        <Form
          ref="editPasswordFormRef"
          :model="editPasswordForm"
          :label-width="100"
          label-position="right"
          :rules="passwordValidate"
          style="width: 450px"
        >
          <FormItem label="原密码" prop="oldPassword">
            <Input
              type="password"
              v-model="editPasswordForm.oldPassword"
              placeholder="请输入现在使用的密码"
            />
          </FormItem>
          <FormItem label="新密码" prop="newPassword">
            <Input
              type="password"
              v-model="editPasswordForm.newPassword"
              placeholder="请输入新密码"
            />
          </FormItem>
          <FormItem label="确认新密码" prop="rePassword">
            <Input
              type="password"
              v-model="editPasswordForm.rePassword"
              placeholder="请再次输入新密码"
            />
          </FormItem>
          <FormItem>
            <Button type="primary" class="mr_10" :loading="savePassLoading" @click="saveEditPass">
              保存
            </Button>
            <Button @click="cancelEditPass">取消</Button>
          </FormItem>
        </Form>
      </div>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { changePass } from '@/api/index'
import { useRouter } from 'vue-router'

const router = useRouter()
const editPasswordFormRef = ref()
const savePassLoading = ref(false)

const editPasswordForm = ref({
  oldPassword: '',
  newPassword: '',
  rePassword: ''
})

const validatePassCheck = (rule: any, value: string, callback: Function) => {
  if (value === '') {
    callback(new Error('请再次输入新密码'))
  } else if (value !== editPasswordForm.value.newPassword) {
    callback(new Error('两次输入密码不一致'))
  } else {
    callback()
  }
}

const passwordValidate = {
  oldPassword: [
    { required: true, message: '请输入原密码', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
  ],
  rePassword: [
    { required: true, message: '请再次输入新密码', trigger: 'blur' },
    { validator: validatePassCheck, trigger: 'blur' }
  ]
}

const saveEditPass = async () => {
  editPasswordFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      savePassLoading.value = true
      try {
        const res = await changePass({
          oldPassword: editPasswordForm.value.oldPassword,
          newPassword: editPasswordForm.value.newPassword
        })
        if (res.success) {
          ElMessage.success('密码修改成功，请重新登录')
          setTimeout(() => {
            router.push({ name: 'login' })
          }, 1500)
        }
      } catch (error) {
        console.error(error)
      } finally {
        savePassLoading.value = false
      }
    }
  })
}

const cancelEditPass = () => {
  editPasswordForm.value = {
    oldPassword: '',
    newPassword: '',
    rePassword: ''
  }
  editPasswordFormRef.value?.resetFields()
}
</script>

<style scoped lang="scss">
.change-pass {
  margin: 20px;
}

.mt_10 {
  margin-top: 10px;
}

.mr_10 {
  margin-right: 10px;
}
</style>

