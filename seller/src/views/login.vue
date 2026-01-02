<template>
  <div class="login" @keyup.enter="handleSubmit('formInline')" @click="handleClickOutside">
    <!-- 顶部logo -->
    <div class="top-content" @click="handleClickOutside">
      <div class="logo-box">
        <img 
          v-if="logoUrl" 
          :src="logoUrlWithTimestamp" 
          @click="router.push('/')"
          alt="Logo"
        />
        <div>欢迎回来</div>
      </div>
    </div>
    
    <!-- 登录主体 包含轮播图 登录模块 -->
    <div class="login-container">
      <!-- 轮播 -->
      <div class="login-carousel">
        <div class="demo-carousel" @click="handleClickOutside">
          <img src="https://lili-system.oss-cn-beijing.aliyuncs.com/background.jpg" alt="背景图" />
        </div>
      </div>
      
      <!-- 登录模块 -->
      <div class="form-box" @click="handleClickOutside">
        <div class="account-number">
          <div class="tab-switch">
            <span>{{ loginType ? '账号登录' : '验证码登录' }}</span>
            <span @click="loginType = !loginType">
              {{ loginType ? '验证码登录' : '账号登录' }}
            </span>
          </div>
        </div>

        <!-- 账号密码登录和验证码登录 -->
        <div class="form-content">
          <!-- 账号密码登录 -->
          <el-form
            v-show="loginType === true"
            ref="formInlineRef"
            :model="formData"
            :rules="rules"
            class="login-form"
          >
            <el-form-item prop="username">
              <el-input
                v-model="formData.username"
                placeholder="用户名"
                clearable
                class="form-input"
              >
                <template #prefix>
                  <el-icon class="input-icon"><User /></el-icon>
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
                class="form-input"
              >
                <template #prefix>
                  <el-icon class="input-icon"><Lock /></el-icon>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                type="danger"
                @click.stop="handleSubmit('formInline')"
                style="width: 100%"
                :loading="loading"
              >
                登录
              </el-button>
            </el-form-item>
          </el-form>

          <!-- 验证码登录 -->
          <el-form
            v-show="loginType === false"
            ref="formSmsRef"
            :model="formSms"
            :rules="smsRules"
            class="login-form"
          >
            <el-form-item prop="mobile">
              <el-input
                v-model="formSms.mobile"
                placeholder="手机号"
                clearable
                class="form-input"
              >
                <template #prefix>
                  <el-icon class="input-icon"><Phone /></el-icon>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item prop="code">
              <el-input v-model="formSms.code" placeholder="手机验证码" class="form-input">
                <template #prefix>
                  <el-icon class="input-icon"><Message /></el-icon>
                </template>
                <template #append>
                  <el-button @click="sendCode" :disabled="codeDisabled">
                    {{ codeMsg }}
                  </el-button>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                @click.stop="verifyBtnClick"
                style="width: 100%"
                :type="verifyStatus ? 'success' : 'default'"
              >
                {{ verifyStatus ? '验证通过' : '点击完成安全验证' }}
              </el-button>
            </el-form-item>
            <el-form-item>
              <el-button
                type="danger"
                @click="handleSubmit('formSms')"
                style="width: 100%"
                :loading="loading"
              >
                登录
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    
    <!-- 拼图验证码 -->
    <Verify
      ref="verifyRef"
      class="verify-con"
      verifyType="LOGIN"
      @change="verifyChange"
    />
    
    <!-- Footer -->
    <div class="foot">
      <div class="copyright">
        Copyright © {{ year }} - Present
        <a href="https://pickmall.cn" target="_blank" style="margin: 0 5px">MallEco</a>
        版权所有
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, Lock, Phone, Message } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import { login, smsLogin, sendSms, userInfo } from '@/api/index'
import { getBaseSite } from '@/api/common'
import Cookies from 'js-cookie'
import Verify from '@/components/verify/index.vue'
import util from '@/libs/util'
import { setStore } from '@/libs/storage'
import { useAppStore } from '@/stores/app'
import { md5 } from '@/utils/md5'

declare const BASE: any

const router = useRouter()
const appStore = useAppStore()

const verifyRef = ref()
const formInlineRef = ref<FormInstance>()
const formSmsRef = ref<FormInstance>()
const logoUrl = ref<string>('')
const loginType = ref(true) // true 账号登录  false 验证码登录
const loading = ref(false)
const year = new Date().getFullYear()

// 表单数据
const formData = ref({
  username: '',
  password: ''
})

const formSms = ref({
  mobile: '',
  code: ''
})

// 验证码相关
const verifyStatus = ref(false) // 是否图片验证通过
const codeMsg = ref('发送验证码')
const time = ref(60)
const codeDisabled = ref(false)
let interval: any = null

// 表单验证规则
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
    {
      pattern: /^1[3-9]\d{9}$/,
      message: '请输入正确的手机号',
      trigger: 'blur'
    }
  ],
  code: [{ required: true, message: '请输入手机验证码', trigger: 'blur' }]
}

// 添加时间戳避免缓存问题
const logoUrlWithTimestamp = computed(() => {
  if (!logoUrl.value) return ''
  const separator = logoUrl.value.includes('?') ? '&' : '?'
  return `${logoUrl.value}${separator}_t=${Date.now()}`
})

// 构建完整的 Logo URL
const buildLogoUrl = (logoPath: string): string => {
  if (!logoPath) return ''
  
  if (logoPath.startsWith('http://') || logoPath.startsWith('https://')) {
    return logoPath
  }
  
  if (logoPath.startsWith('/')) {
    const backendBase = import.meta.env.MODE === 'development' 
      ? BASE.API_DEV.common.replace('/api', '')
      : BASE.API_PROD.common.replace('/api', '')
    return `${backendBase}${logoPath}`
  }
  
  return logoPath
}

// 从后端获取 Logo
const fetchLogo = () => {
  getBaseSite()
    .then((res: any) => {
      if (res?.success && res?.result) {
        let logoPath = ''
        
        if (res.result.settingValue) {
          try {
            const settingData = typeof res.result.settingValue === 'string' 
              ? JSON.parse(res.result.settingValue) 
              : res.result.settingValue
            
            logoPath = settingData?.domainLogo || settingData?.siteLogo || ''
          } catch (error) {
            // 静默处理解析错误
          }
        }
        
        if (!logoPath) {
          logoPath = res.result.domainLogo || res.result.siteLogo || ''
        }
        
        if (logoPath) {
          logoUrl.value = buildLogoUrl(logoPath)
        }
      }
    })
    .catch((error: any) => {
      if (error.code !== 'ERR_NETWORK' && error.code !== 'ERR_CONNECTION_REFUSED') {
        console.warn('[Logo] 获取失败:', error.message)
      }
    })
}

// 监听登录类型切换
watch(loginType, (val) => {
  if (val) {
    formInlineRef.value?.resetFields()
  } else {
    formSmsRef.value?.resetFields()
  }
  verifyStatus.value = false
  verifyRef.value.show = false
  clearInterval(interval)
  codeMsg.value = '发送验证码'
  time.value = 60
  codeDisabled.value = false
})

// 初始化
onMounted(() => {
  fetchLogo()
})

// 组件销毁时清理
onUnmounted(() => {
  if (interval) {
    clearInterval(interval)
  }
})

// 登录成功后的处理
const afterLogin = (res: any) => {
  const accessToken = res.result.accessToken
  const refreshToken = res.result.refreshToken
  setStore('accessToken', accessToken)
  setStore('refreshToken', refreshToken)

  userInfo().then((res: any) => {
    if (res.success) {
      Cookies.set('userInfoSeller', JSON.stringify(res.result))
      appStore.setAvatarPath(res.result.avatar)
      
      // 初始化路由并等待完成后再跳转
      util.initRouter(router).then(() => {
        setTimeout(() => {
          router.push({
            name: 'home_index'
          }).then(() => {
            console.log('跳转成功')
            loading.value = false
          }).catch((err) => {
            console.error('路由跳转失败:', err)
            router.push('/home').then(() => {
              console.log('路径跳转成功')
              loading.value = false
            }).catch(() => {
              console.error('路径跳转也失败')
              loading.value = false
              ElMessage.error('路由跳转失败，请刷新页面')
            })
          })
        }, 100)
      }).catch((err) => {
        console.error('路由初始化失败:', err)
        loading.value = false
        ElMessage.error('路由初始化失败，请刷新页面')
      })
    } else {
      loading.value = false
      ElMessage.error(res.message || '获取用户信息失败')
    }
  }).catch((err) => {
    console.error('获取用户信息失败:', err)
    loading.value = false
    ElMessage.error('获取用户信息失败，请重试')
  })
}

// 登录提交
const handleSubmit = (name: string) => {
  if (name === 'formInline') {
    formInlineRef.value?.validate((valid: boolean) => {
      if (valid) {
        verifyRef.value?.init()
      }
    })
  } else if (name === 'formSms') {
    formSmsRef.value?.validate((valid: boolean) => {
      if (valid) {
        if (!verifyStatus.value) {
          ElMessage.warning('请先完成安全验证')
          return
        }
        const data = { ...formSms.value }
        smsLogin(data).then((res: any) => {
          verifyRef.value.show = false
          if (res.success) {
            ElMessage.success('登录成功')
            afterLogin(res)
          } else {
            ElMessage.error(res.message || '登录失败')
          }
        })
      }
    })
  }
}

// 验证码变化
const verifyChange = (con: any) => {
  if (!con.status) return

  if (loginType.value === true) {
    // 账号密码登录
    loading.value = true
    const data = { ...formData.value }
    data.password = md5(data.password)
    verifyRef.value.show = false

    login(data)
      .then((res: any) => {
        if (res && res.success) {
          ElMessage.success('登录成功')
          afterLogin(res)
        } else {
          loading.value = false
          ElMessage.error(res?.message || '登录失败')
        }
      })
      .catch(() => {
        loading.value = false
      })
  } else {
    // 验证码登录
    verifyStatus.value = true
    verifyRef.value.show = false
  }
}

// 开启滑块验证
const verifyBtnClick = () => {
  if (!verifyStatus.value) {
    verifyRef.value?.init()
  }
}

// 发送验证码
const sendCode = () => {
  if (time.value === 60) {
    if (formSms.value.mobile === '') {
      ElMessage.warning('请先填写手机号')
      return
    }
    if (!verifyStatus.value) {
      ElMessage.warning('请先完成安全验证')
      return
    }
    const params = {
      mobile: formSms.value.mobile,
      verificationEnums: 'LOGIN'
    }
    sendSms(params).then((res: any) => {
      if (res.success) {
        ElMessage.success('验证码发送成功')
        codeDisabled.value = true
        interval = setInterval(() => {
          time.value--
          if (time.value === 0) {
            time.value = 60
            codeMsg.value = '重新发送'
            verifyStatus.value = false
            codeDisabled.value = false
            clearInterval(interval)
          } else {
            codeMsg.value = `${time.value}秒`
          }
        }, 1000)
      } else {
        ElMessage.warning(res.message || '发送失败')
      }
    })
  }
}

// 点击外部关闭验证码
const handleClickOutside = () => {
  if (verifyRef.value) {
    verifyRef.value.show = false
  }
}
</script>

<style lang="scss" scoped>
.login {
  height: 100vh;
  background-color: #f0f2f5;
  overflow: hidden;
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
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;

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
  background: rgba(255, 255, 255, 0.8);
  border-radius: 8px;

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
          color: $theme_color;
        }
      }
    }
  }

  .form-content {
    min-height: 200px;
  }
}

.login-form {
  :deep(.el-form-item) {
    margin-bottom: 20px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .form-input {
    :deep(.el-input__wrapper) {
      border-radius: 4px;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;

      &:hover {
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12);
      }

      &.is-focus {
        border-color: $theme_color;
        box-shadow: 0 0 0 2px rgba(255, 92, 88, 0.1);
      }
    }
  }

  .input-icon {
    color: #909399;
    font-size: 18px;
  }
}

.verify-con {
  position: absolute;
  right: 16%;
  top: 90px;
  z-index: 10;
}

.foot {
  position: fixed;
  bottom: 4vh;
  width: 100%;
  left: 0;
  color: rgba(0, 0, 0, 0.45);
  font-size: 14px;
  text-align: center;

  .copyright {
    text-align: center;
    
    a {
      color: rgba(0, 0, 0, 0.45);
      text-decoration: none;
      
      &:hover {
        color: rgba(0, 0, 0, 0.65);
      }
    }
  }
}
</style>

