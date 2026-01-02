<template>
  <div class="sign-up" @click="handleClickOutside">
    <div style="height: 50px"></div>
    <div class="logo-box">
      <img width="150" :src="logoImg" @click="$router.push('/')" />
      <div>注册</div>
    </div>
    <div class="login-container">
      <!-- 注册表单 -->
      <el-form
        ref="formRegistRef"
        :model="formRegist"
        :rules="rules"
        style="width: 300px"
      >
        <el-form-item prop="username">
          <el-input
            v-model="formRegist.username"
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
            v-model="formRegist.password"
            type="password"
            placeholder="请输入大于6位密码"
            clearable
            show-password
          >
            <template #prefix>
              <el-icon><Lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="mobilePhone">
          <el-input
            v-model="formRegist.mobilePhone"
            placeholder="手机号"
            clearable
          >
            <template #prefix>
              <el-icon><Phone /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="code">
          <el-input v-model="formRegist.code" placeholder="手机验证码">
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
          <el-button type="danger" size="large" @click="handleRegist" style="width: 100%">
            注册
          </el-button>
        </el-form-item>
        <el-form-item>
          <span class="color999 ml_20">
            点击注册，表示您同意《
            <router-link to="/article?id=1371992704333905920" target="_blank"
              >商城用户协议</router-link
            >》
          </span>
        </el-form-item>
      </el-form>
      <div class="login-btn">
        已有账号？<a @click="$router.push('/login')">立即登录</a>
      </div>
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

      <!-- 滑块验证码 -->
      <Verify
        ref="verifyRef"
        class="verify-con"
        verifyType="REGISTER"
        @change="verifyChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { User, Lock, Phone, Message } from '@element-plus/icons-vue'
import { regist } from '@/api/login'
import { sendSms } from '@/api/common'
import { md5 } from '@/utils/md5'
import storage from '@/utils/storage'
import Verify from '@/components/verify/index.vue'

const router = useRouter()
const formRegistRef = ref<FormInstance>()
const verifyRef = ref()

const verifyStatus = ref<boolean>(false)
const codeCountdown = ref<number>(0)
const codeMsg = ref<string>('发送验证码')
const logoImg = ref<string>('')
const siteName = ref<string>('MallEco 购物商城')
const year = new Date().getFullYear()

const formRegist = reactive({
  mobilePhone: '',
  code: '',
  username: '',
  password: ''
})

const mobilePattern = /^1[3-9]\d{9}$/

const rules: FormRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码不能少于6位', trigger: 'blur' }
  ],
  mobilePhone: [
    { required: true, message: '请输入手机号码', trigger: 'blur' },
    { pattern: mobilePattern, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  code: [{ required: true, message: '请输入手机验证码', trigger: 'blur' }]
}

// 注册
const handleRegist = async () => {
  if (!formRegistRef.value) return

  await formRegistRef.value.validate(async (valid) => {
    if (valid) {
      try {
        const data = {
          ...formRegist,
          password: md5(formRegist.password)
        }
        const res = await regist(data)
        const result = res.data || res

        if (result.success) {
          ElMessage.success('注册成功！')
          router.push('/login')
        } else {
          ElMessage.error(result.message || '注册失败')
        }
      } catch (error: any) {
        ElMessage.error(error.message || '注册失败')
      }
    }
  })
}

// 发送验证码
const sendCode = async () => {
  if (codeCountdown.value > 0) return

  if (!formRegist.mobilePhone) {
    ElMessage.warning('请先填写手机号')
    return
  }

  if (!verifyStatus.value) {
    ElMessage.warning('请先完成安全验证')
    return
  }

  try {
    const params = {
      mobile: formRegist.mobilePhone,
      verificationEnums: 'REGISTER'
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

  formRegistRef.value?.resetFields()
  const signUpElement = document.querySelector('.sign-up') as HTMLElement
  if (signUpElement) {
    signUpElement.style.height = window.innerHeight + 'px'
  }
})
</script>

<style scoped lang="scss">
.sign-up {
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
}

.color999 {
  color: #999;
}

  .ml_20 {
    margin-left: 20px;
  }

  .verify-con {
    position: absolute;
    right: 20px;
    top: 120px;
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

