<template>
  <div class="login" @keyup.enter="handleSubmit" @click="handleClickOutside">
    <!-- 顶部logo -->
    <div class="top-content">
      <div class="logo-box">
        <img :src="logoImg" @click="$router.push('/')" />
        <div>欢迎登录</div>
      </div>
    </div>

    <!-- 登录主体 -->
    <div class="login-container">
      <!-- 轮播 -->
      <el-carousel :interval="5000" arrow="never" class="login-carousel">
        <el-carousel-item>
          <div class="demo-carousel">
            <img
              src="https://lili-system.oss-cn-beijing.aliyuncs.com/background.jpg"
              alt="背景图"
            />
          </div>
        </el-carousel-item>
      </el-carousel>

      <!-- 登录模块 -->
      <div class="form-box">
        <div class="account-number">
          <div class="tab-switch">
            <span>{{ loginType ? '账号登录' : '验证码登录' }}</span>
            <span @click="loginType = !loginType">{{
              loginType ? '验证码登录' : '账号登录'
            }}</span>
          </div>
        </div>

        <!-- 账号密码登录 -->
        <el-form
          ref="formInlineRef"
          :model="formData"
          :rules="rules"
          v-show="loginType"
        >
          <el-form-item prop="username">
            <el-input
              v-model="formData.username"
              placeholder="用户名"
              clearable
            >
              <template #prefix>
                <el-icon><User /></el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="formData.password"
              type="password"
              placeholder="密码"
              clearable
              show-password
            >
              <template #prefix>
                <el-icon><Lock /></el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="danger" @click="handleSubmit" style="width: 100%">
              登录
            </el-button>
          </el-form-item>
        </el-form>

        <!-- 验证码登录 -->
        <el-form
          ref="formSmsRef"
          :model="formSms"
          :rules="smsRules"
          v-show="!loginType"
        >
          <el-form-item prop="mobile">
            <el-input
              v-model="formSms.mobile"
              placeholder="手机号"
              clearable
            >
              <template #prefix>
                <el-icon><Phone /></el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="code">
            <el-input v-model="formSms.code" placeholder="手机验证码">
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
              @click="handleSmsVerify"
              :type="verifyStatus ? 'success' : 'default'"
              style="width: 100%"
            >
              {{ verifyStatus ? '验证通过' : '点击完成安全验证' }}
            </el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="danger" @click="handleSmsSubmit" style="width: 100%">
              登录
            </el-button>
          </el-form-item>
        </el-form>

        <div class="other">
          <div class="register">
            <span style="color: red" @click="$router.push('/signUp')">
              还没有账号？点击立即注册
            </span>
            <span @click="$router.push('/forgetPassword')">忘记密码</span>
          </div>
        </div>
      </div>

      <!-- 滑块验证码 -->
      <Verify
        ref="verifyRef"
        class="verify-con"
        verifyType="LOGIN"
        @change="verifyChange"
      />
    </div>

    <div class="foot">
      <div class="help">
        <router-link to="/article" class="item" target="_blank">帮助</router-link>
        <router-link to="/article?id=1371779927900160000" class="item" target="_blank"
          >隐私</router-link
        >
        <router-link to="/article?id=1371992704333905920" class="item" target="_blank"
          >条款</router-link
        >
      </div>
      <div class="copyright">
        Copyright © {{ year }} - Present
        <a href="https://pickmall.cn" target="_blank" style="margin: 0 5px">{{
          siteName
        }}</a>
        版权所有
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { User, Lock, Phone, Message } from '@element-plus/icons-vue'
import { login, smsLogin } from '@/api/login'
import { sendSms } from '@/api/common'
import { useUserStore } from '@/stores/user'
import { useCartStore } from '@/stores/cart'
import storage from '@/utils/storage'
import { md5 } from '@/utils/md5'
import Verify from '@/components/verify/index.vue'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const cartStore = useCartStore()

const loginType = ref<boolean>(true) // true 账号登录, false 验证码登录
const formInlineRef = ref<FormInstance>()
const formSmsRef = ref<FormInstance>()
const verifyRef = ref()
const verifyStatus = ref<boolean>(false)
const codeCountdown = ref<number>(0)
const codeMsg = ref<string>('发送验证码')
const logoImg = ref<string>('')
const siteName = ref<string>('MallEco 购物商城')
const year = new Date().getFullYear()

const formData = reactive({
  username: '',
  password: ''
})

const formSms = reactive({
  mobile: '',
  code: ''
})

// 手机号验证规则
const mobilePattern = /^1[3-9]\d{9}$/

const rules: FormRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码不能少于6位', trigger: 'blur' }
  ]
}

const smsRules: FormRules = {
  mobile: [
    { required: true, message: '请输入手机号码', trigger: 'blur' },
    { pattern: mobilePattern, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  code: [{ required: true, message: '请输入手机验证码', trigger: 'blur' }]
}

// 处理账号密码登录
const handleSubmit = async () => {
  if (!formInlineRef.value) return

  await formInlineRef.value.validate(async (valid) => {
    if (valid) {
      verifyRef.value?.init()
    }
  })
}

// 处理验证码登录
const handleSmsSubmit = async () => {
  if (!formSmsRef.value) return
  if (!verifyStatus.value) {
    ElMessage.warning('请先完成安全验证')
    return
  }

  await formSmsRef.value.validate(async (valid) => {
    if (valid) {
      try {
        const res = await smsLogin(formSms)
        const result = res.data || res

        if (result.success && result.result) {
          await loginSuccess(result.result.accessToken, result.result.refreshToken)
        } else {
          ElMessage.error(result.message || '登录失败')
        }
      } catch (error: any) {
        ElMessage.error(error.message || '登录失败')
      }
    }
  })
}

// 登录成功处理
const loginSuccess = async (accessToken: string, refreshToken?: string) => {
  ElMessage.success('登录成功')
  userStore.setToken(accessToken, refreshToken)
  await userStore.fetchUserInfo()
  cartStore.fetchCartCount()

  const query = route.query
  if (query.rePath) {
    router.push({
      path: query.rePath as string,
      query: query.query ? JSON.parse(query.query as string) : {}
    })
  } else {
    router.push('/')
  }
}

// 发送验证码
const sendCode = async () => {
  if (codeCountdown.value > 0) return

  if (!formSms.mobile) {
    ElMessage.warning('请先填写手机号')
    return
  }

  if (!verifyStatus.value) {
    ElMessage.warning('请先完成安全验证')
    return
  }

  try {
    const params = {
      mobile: formSms.mobile,
      verificationEnums: 'LOGIN'
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
  if (!con.status) return

  if (loginType.value === true) {
    // 账号密码登录
    try {
      const data = {
        username: formData.username,
        password: md5(formData.password)
      }
      login(data)
        .then(async (res: any) => {
          const result = res.data || res
          verifyRef.value.show = false

          if (result.success && result.result) {
            await loginSuccess(result.result.accessToken, result.result.refreshToken)
          } else {
            ElMessage.error(result.message || '登录失败')
          }
        })
        .catch((error: any) => {
          verifyRef.value.show = false
          ElMessage.error(error.message || '登录失败')
        })
    } catch (error: any) {
      verifyRef.value.show = false
      ElMessage.error(error.message || '登录失败')
    }
  } else {
    // 验证码登录
    verifyStatus.value = true
    verifyRef.value.show = false
  }
}

// 安全验证
const handleSmsVerify = () => {
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

// 监听登录方式切换
watch(loginType, () => {
  verifyStatus.value = false
  codeCountdown.value = 0
  codeMsg.value = '发送验证码'
  formInlineRef.value?.resetFields()
  formSmsRef.value?.resetFields()
})

onMounted(() => {
  // 初始化站点信息
  const storedSiteName = storage.getItem('siteName')
  const storedLogo = storage.getItem('logoImg')
  if (storedSiteName) {
    siteName.value = storedSiteName
  }
  if (storedLogo) {
    logoImg.value = storedLogo
  }

  // 处理第三方登录回调
  const uuid = route.query.state as string
  if (uuid) {
    storage.setItem('uuid', uuid)
    // TODO: 处理第三方登录回调
  }
})
</script>

<style scoped lang="scss">
.login {
  min-height: 100vh;
  background-color: #f0f2f5;
  position: relative;
}

.top-content {
  width: 100%;
  height: 80px;
  position: relative;
  z-index: 1;
  box-shadow: 0 1px 1px #ddd;
  background-color: #fff;

  .logo-box {
    width: 80%;
    max-width: 1200px;
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
}

.login-container {
  position: relative;
  width: 100%;
  height: 550px;
}

.login-carousel {
  width: 100%;
  height: 550px;

  .demo-carousel {
    height: 550px;
    width: inherit;
    display: flex;
    justify-content: center;
    align-items: center;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
}

.form-box {
  width: 350px;
  box-sizing: border-box;
  position: absolute;
  top: 80px;
  right: 15%;
  padding: 20px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 4px;

  .account-number {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    font-weight: bold;
    margin-bottom: 20px;

    .tab-switch {
      height: 40px;
      font-size: 14px;

      span:nth-child(1) {
        font-size: 16px;
        border-right: 1px solid #ddd;
        padding-right: 10px;
      }

      span:nth-child(2) {
        cursor: pointer;
        padding-left: 10px;

        &:hover {
          color: #f31947;
        }
      }
    }
  }
}

.other {
  margin-top: 20px;
}

.register {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;

  span {
    cursor: pointer;
    font-size: 12px;

    &:hover {
      color: #f31947;
    }
  }
}

.verify-con {
  position: absolute;
  right: 15%;
  top: 90px;
  z-index: 10;
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

