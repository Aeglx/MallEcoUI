<template>
  <div class="forget-password" @click="handleClickOutside">
    <div style="height: 50px"></div>
    <!-- 顶部logo -->
    <div class="logo-box">
      <img :src="logoImg" width="150" @click="$router.push('/')" />
      <div>修改密码</div>
    </div>
    <div class="login-container">
      <!-- 验证手机号 -->
      <el-form
        ref="formFirstRef"
        :model="formFirst"
        :rules="firstRules"
        style="width: 300px"
        v-show="step === 0"
      >
        <el-form-item prop="mobile">
          <el-input v-model="formFirst.mobile" placeholder="手机号" clearable>
            <template #prefix>
              <el-icon><Phone /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="code">
          <el-input v-model="formFirst.code" placeholder="手机验证码" clearable>
            <template #prefix>
              <el-icon><Message /></el-icon>
            </template>
            <template #append>
              <el-button @click="sendCode" :disabled="codeCountdown > 0">
                {{ codeMsg }}
              </el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            @click="handleVerify"
            :type="verifyStatus ? 'success' : 'default'"
            style="width: 100%"
          >
            {{ verifyStatus ? '验证通过' : '点击完成安全验证' }}
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="danger" @click="next" :loading="loading" style="width: 100%">
            下一步
          </el-button>
        </el-form-item>
      </el-form>

      <!-- 设置新密码 -->
      <el-form
        ref="formRef"
        :model="form"
        :rules="passwordRules"
        style="width: 300px"
        v-show="step === 1"
      >
        <el-form-item prop="password">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="请输入至少六位密码"
            clearable
            show-password
          >
            <template #prefix>
              <el-icon><Lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="oncePasd">
          <el-input
            v-model="form.oncePasd"
            type="password"
            placeholder="请再次输入密码"
            clearable
            show-password
          >
            <template #prefix>
              <el-icon><Lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="danger" size="large" @click="handleSubmit" :loading="loading1" style="width: 100%">
            提交
          </el-button>
        </el-form-item>
      </el-form>

      <div class="login-btn">
        <a @click="$router.push('/login')">前往登录</a>
      </div>
    </div>
    <div class="foot">
      <div class="help">
        <a class="item" href="https://pickmall.cn/" target="_blank">帮助</a>
        <a class="item" href="https://pickmall.cn/" target="_blank">隐私</a>
        <a class="item" href="https://pickmall.cn/" target="_blank">条款</a>
      </div>
      <div class="copyright">
        Copyright © {{ year }} - Present
        <a href="https://pickmall.cn/" target="_blank" style="margin: 0 5px">{{
          siteName
        }}</a>
        版权所有
      </div>

      <!-- 滑块验证码 -->
      <Verify
        ref="verifyRef"
        class="verify-con"
        verifyType="FIND_USER"
        @change="verifyChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { Phone, Message, Lock } from '@element-plus/icons-vue'
import { validateCode, resetPassword } from '@/api/login'
import { sendSms } from '@/api/common'
import { md5 } from '@/utils/md5'
import storage from '@/utils/storage'
import Verify from '@/components/verify/index.vue'

const router = useRouter()
const formFirstRef = ref<FormInstance>()
const formRef = ref<FormInstance>()
const verifyRef = ref()

const loading = ref<boolean>(false)
const loading1 = ref<boolean>(false)
const step = ref<number>(0)
const verifyStatus = ref<boolean>(false)
const codeCountdown = ref<number>(0)
const codeMsg = ref<string>('发送验证码')
const logoImg = ref<string>('')
const siteName = ref<string>('MallEco 购物商城')
const year = new Date().getFullYear()

const formFirst = reactive({
  mobile: '',
  code: ''
})

const form = reactive({
  password: '',
  oncePasd: ''
})

const mobilePattern = /^1[3-9]\d{9}$/
const passwordPattern = /.{6,}/

const firstRules: FormRules = {
  mobile: [
    { required: true, message: '请输入手机号码', trigger: 'blur' },
    { pattern: mobilePattern, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  code: [{ required: true, message: '请输入手机验证码', trigger: 'blur' }]
}

const validatePassword = (rule: any, value: string, callback: any) => {
  if (value !== form.password) {
    callback(new Error('两次输入密码不一致'))
  } else {
    callback()
  }
}

const passwordRules: FormRules = {
  password: [
    { required: true, message: '密码不能为空', trigger: 'blur' },
    { pattern: passwordPattern, message: '密码不能少于6位', trigger: 'blur' }
  ],
  oncePasd: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    { validator: validatePassword, trigger: 'blur' }
  ]
}

// 下一步：验证手机号和验证码
const next = async () => {
  if (!formFirstRef.value) return

  await formFirstRef.value.validate(async (valid) => {
    if (valid) {
      if (!verifyStatus.value) {
        ElMessage.warning('请先完成安全验证')
        return
      }

      loading.value = true
      try {
        const params = {
          mobile: formFirst.mobile,
          validCode: formFirst.code
        }
        const res = await validateCode(params)
        const result = res.data || res

        if (result.success) {
          step.value = 1
          ElMessage.success('验证成功，请设置新密码')
        } else {
          ElMessage.error(result.message || '验证失败')
        }
      } catch (error: any) {
        ElMessage.error(error.message || '验证失败')
      } finally {
        loading.value = false
      }
    }
  })
}

// 提交：重置密码
const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (valid) {
      loading1.value = true
      try {
        const params = {
          mobile: formFirst.mobile,
          password: md5(form.password),
          validCode: formFirst.code
        }
        const res = await resetPassword(params)
        const result = res.data || res

        if (result.success) {
          ElMessage.success('密码重置成功！')
          router.push('/login')
        } else {
          ElMessage.error(result.message || '重置失败')
        }
      } catch (error: any) {
        ElMessage.error(error.message || '重置失败')
      } finally {
        loading1.value = false
      }
    }
  })
}

// 发送验证码
const sendCode = async () => {
  if (codeCountdown.value > 0) return

  if (!formFirst.mobile) {
    ElMessage.warning('请先填写手机号')
    return
  }

  if (!verifyStatus.value) {
    ElMessage.warning('请先完成安全验证')
    return
  }

  try {
    const params = {
      mobile: formFirst.mobile,
      verificationEnums: 'FIND_USER'
    }
    const res = await sendSms(params)
    const result = res.data || res

    if (result.success) {
      ElMessage.success('验证码发送成功')
      startCountdown()
    } else {
      ElMessage.error(result.message || '发送失败')
    }
  } catch (error: any) {
    ElMessage.error(error.message || '发送失败')
  }
}

// 开始倒计时
const startCountdown = () => {
  codeCountdown.value = 60
  const timer = setInterval(() => {
    codeCountdown.value--
    if (codeCountdown.value <= 0) {
      clearInterval(timer)
      codeMsg.value = '重新发送'
      verifyStatus.value = false
    } else {
      codeMsg.value = `${codeCountdown.value}秒后重试`
    }
  }, 1000)
}

// 验证码变化
const verifyChange = (con: any) => {
  if (con.status) {
    verifyStatus.value = true
    verifyRef.value.show = false
  }
}

// 安全验证
const handleVerify = () => {
  if (!verifyStatus.value) {
    verifyRef.value?.init()
  }
}

// 点击外部关闭验证码
const handleClickOutside = () => {
  if (verifyRef.value) {
    verifyRef.value.show = false
  }
}

onMounted(() => {
  const storedSiteName = storage.getItem('siteName')
  const storedLogo = storage.getItem('logoImg')
  if (storedSiteName) {
    siteName.value = storedSiteName
  }
  if (storedLogo) {
    logoImg.value = storedLogo
  }

  formFirstRef.value?.resetFields()
  formRef.value?.resetFields()
  const forgetPasswordElement = document.querySelector('.forget-password') as HTMLElement
  if (forgetPasswordElement) {
    forgetPasswordElement.style.minHeight = window.innerHeight + 'px'
  }
})
</script>

<style scoped lang="scss">
.forget-password {
  min-height: 100vh;
  background-color: #f0f2f5;
}

.logo-box {
  width: 600px;
  height: 80px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  img {
    width: 150px;
    cursor: pointer;
  }
  div {
    font-size: 20px;
    margin-top: 10px;
    margin-left: 20px;
  }
}

.login-container {
  border-top: 2px solid #f31947;
  position: relative;
  margin: 0 auto;
  width: 600px;
  background-color: #fff;
  padding: 20px 150px;

  .login-btn {
    position: absolute;
    right: 20px;
    top: -45px;

    a {
      color: #f31947;
      cursor: pointer;

      &:hover {
        text-decoration: underline;
      }
    }
  }

  .verify-con {
    position: absolute;
    right: 20px;
    top: 120px;
    z-index: 10;
  }
}

.foot {
  position: fixed;
  bottom: 4vh;
  width: 368px;
  left: calc(50% - 184px);
  color: rgba(0, 0, 0, 0.45);
  font-size: 14px;

  .help {
    margin: 0 auto;
    margin-bottom: 1vh;
    width: 60%;
    display: flex;
    justify-content: space-around;

    .item {
      color: rgba(0, 0, 0, 0.45);
      text-decoration: none;

      &:hover {
        color: rgba(0, 0, 0, 0.65);
      }
    }
  }

  .copyright {
    text-align: center;
  }
}
</style>

