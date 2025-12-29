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
        <!-- 登录表单内容将在这里添加 -->
        <div class="account-number">
          <div class="tab-switch">
            <span>{{ loginType ? '账号登录' : '验证码登录' }}</span>
            <span @click="loginType = !loginType; scannerCodeLoginFlag = false">
              {{ loginType ? '验证码登录' : '账号登录' }}
            </span>
          </div>
          <div @click="scannerCodeLoginFlag = !scannerCodeLoginFlag">
            {{ !scannerCodeLoginFlag ? '扫码登录' : '返回' }}
          </div>
        </div>
        
        <!-- 扫码登录 -->
        <div v-show="scannerCodeLoginFlag" class="qr-login-content">
          <div class="qr-container">
            <div class="qr-shadow flex" v-show="qrCodeStatus === 'fail'">
              <span>二维码已失效</span>
              <el-button 
                size="small" 
                @click="createPCLoginSession"
                :loading="qrCodeLoading"
                :disabled="qrCodeLoading"
              >
                刷新二维码
              </el-button>
            </div>
            <img
              v-if="qrCodeImageUrl"
              :src="qrCodeImageUrl"
              alt="二维码"
              style="width: 150px; height: 150px; display: block; margin: 0 auto;"
            />
          </div>
          <div class="drag-area">
            <!-- 等待扫码 -->
            <div v-if="scannerCodeLoginStatus === 0" class="pending-scan">
              <p>打开手机App/小程序，扫码登录</p>
            </div>
            <!-- 已经扫码 -->
            <div v-else-if="scannerCodeLoginStatus === 1" class="scanned">
              <p>扫码成功，等待确认</p>
            </div>
            <!-- 登录成功 -->
            <div v-if="scannerCodeLoginStatus === 2" class="scanned">
              <p>登录成功，正在页面跳转</p>
            </div>
            <!-- 取消登录 -->
            <div v-else-if="scannerCodeLoginStatus === 3" class="quick-logining">
              <p>取消登录</p>
            </div>
          </div>
        </div>

        <!-- 账号密码登录和验证码登录 -->
        <div v-show="!scannerCodeLoginFlag" class="form-content">
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
              <el-input
                v-model="formSms.code"
                placeholder="手机验证码"
                class="form-input"
              >
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
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, Lock, Phone, Message } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import { login, smsLogin, sendSms, userInfo, getSCLoginCode, sCLogin } from '@/api/index'
import { getBaseSite } from '@/api/common'
// @ts-ignore
import Cookies from 'js-cookie'
import Verify from '@/components/verify/index.vue'
import QRCode from 'qrcode'
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
const scannerCodeLoginFlag = ref(false) // 是否显示扫码登录
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

// 扫码登录相关
const qrCodeStatus = ref<'success' | 'fail'>('success')
const qrCode = ref('')
const qrCodeImageUrl = ref('') // 二维码图片URL
const qrSessionToken = ref('')
const scannerCodeLoginStatus = ref(0) // 0:等待扫码 1:已扫码 2:登录成功 3:取消登录
const qrCodeLoading = ref(false) // 二维码加载状态
let qrCodeTimer: any = null
let qrLoginTimer: any = null // 轮询定时器
let createSessionLock = false // 防止重复请求的锁

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

// 构建完整的 Logo URL - 仅从后端获取
const buildLogoUrl = (logoPath: string): string => {
  if (!logoPath) return ''
  
  // 如果是完整 URL，直接返回
  if (logoPath.startsWith('http://') || logoPath.startsWith('https://')) {
    return logoPath
  }
  
  // 如果是相对路径，拼接后端基础地址
  if (logoPath.startsWith('/')) {
    const backendBase = import.meta.env.MODE === 'development' 
      ? BASE.API_DEV.common.replace('/api', '')
      : BASE.API_PROD.common.replace('/api', '')
    const fullUrl = `${backendBase}${logoPath}`
    console.log('[Logo] 构建URL:', { logoPath, backendBase, fullUrl })
    return fullUrl
  }
  
  return logoPath
}

// 从后端获取 Logo
const fetchLogo = () => {
  getBaseSite()
    .then((res: any) => {
      if (res?.success && res?.result) {
        let logoPath = ''
        
        // 解析 settingValue（可能是字符串或对象）
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
        
        // 直接检查 result 中的字段
        if (!logoPath) {
          logoPath = res.result.domainLogo || res.result.siteLogo || ''
        }
        
        if (logoPath) {
          logoUrl.value = buildLogoUrl(logoPath)
        }
      }
    })
    .catch((error: any) => {
      // 静默处理错误，避免在开发环境显示网络错误
      // 如果后端未启动，logoUrl 将保持为空，页面仍可正常显示
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

// 监听扫码登录切换
watch(scannerCodeLoginFlag, (val) => {
  if (val) {
    createPCLoginSession()
  } else {
    clearQRLoginInfo()
  }
})

// 初始化
onMounted(() => {
  fetchLogo()
})

// 组件销毁时清理
import { onUnmounted } from 'vue'
onUnmounted(() => {
  clearQRLoginInfo()
  if (interval) {
    clearInterval(interval)
  }
  if (qrLoginTimer) {
    clearTimeout(qrLoginTimer)
    qrLoginTimer = null
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
      Cookies.set('userInfoManager', JSON.stringify(res.result))
      appStore.setAvatarPath(res.result.avatar)
      
      // 初始化路由并等待完成后再跳转
      util.initRouter(router).then(() => {
        // 路由初始化完成后再跳转，使用 nextTick 确保路由已添加
        setTimeout(() => {
          router.push({
            name: 'home_index'
          }).then(() => {
            console.log('跳转成功')
            loading.value = false
          }).catch((err) => {
            console.error('路由跳转失败:', err)
            // 如果路由名称不存在，尝试使用路径跳转
            router.push('/home').then(() => {
              console.log('路径跳转成功')
              loading.value = false
            }).catch(() => {
              console.error('路径跳转也失败')
              loading.value = false
              ElMessage.error('路由跳转失败，请刷新页面')
            })
          })
        }, 100) // 给路由一点时间完成添加
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

    // 改为发送JSON格式，而不是FormData
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

// 生成二维码图片
const generateQRCode = async (text: string) => {
  try {
    const url = await QRCode.toDataURL(text, {
      width: 150,
      margin: 0,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    })
    qrCodeImageUrl.value = url
  } catch (error) {
    console.error('生成二维码失败:', error)
    ElMessage.error('生成二维码失败')
  }
}

// 扫码登录相关函数
const createPCLoginSession = async () => {
  // 防止重复请求
  if (createSessionLock || qrCodeLoading.value) {
    return
  }
  
  createSessionLock = true
  qrCodeLoading.value = true
  
  try {
    const response = await getSCLoginCode({})
    clearQRLoginInfo()
    
    if (response.code === 200 || response.success) {
      qrCodeStatus.value = 'success'
      const session = response.result
      qrSessionToken.value = session.token
      if (session.status === 0) {
        qrCode.value = session.token
        // 生成二维码图片
        await generateQRCode(session.token)
        refreshQrCode()
      }
      // 延迟一下再开始轮询，避免立即请求
      setTimeout(() => {
        qrLogin()
      }, 500)
    } else {
      ElMessage.error(response.message || '获取二维码失败')
    }
  } catch (error: any) {
    console.error('获取二维码失败:', error)
    if (error.response?.status === 429) {
      ElMessage.warning('请求过于频繁，请稍后再试')
    } else {
      ElMessage.error('获取二维码失败，请检查后端接口')
    }
  } finally {
    qrCodeLoading.value = false
    // 延迟解锁，防止快速重复点击
    setTimeout(() => {
      createSessionLock = false
    }, 1000)
  }
}

const refreshQrCode = () => {
  if (!qrCodeTimer) {
    qrCodeTimer = setInterval(() => {
      qrCodeStatus.value = 'fail' // 如果过期将二维码转为失效状态
    }, 10 * 1000)
  }
}

const clearQRLoginInfo = () => {
  scannerCodeLoginStatus.value = 0
  qrSessionToken.value = ''
  qrCode.value = ''
  qrCodeImageUrl.value = ''
  qrCodeLoading.value = false
  createSessionLock = false
  if (qrCodeTimer) {
    clearInterval(qrCodeTimer)
  }
  qrCodeTimer = null
  if (qrLoginTimer) {
    clearTimeout(qrLoginTimer)
  }
  qrLoginTimer = null
}

const qrLogin = async () => {
  if (!qrSessionToken.value) {
    clearQRLoginInfo()
    return
  }
  
  // 清除之前的定时器，避免重复请求
  if (qrLoginTimer) {
    clearTimeout(qrLoginTimer)
    qrLoginTimer = null
  }
  
  sCLogin(qrSessionToken.value, { beforeSessionStatus: scannerCodeLoginStatus.value }).then((response: any) => {
    if (response.success) {
      scannerCodeLoginStatus.value = response.result.status
      switch (response.result.status) {
        case 0: // 等待扫码
        case 1: // 已扫码，等待确认
          // 延迟2秒后再次轮询，避免频繁请求
          qrLoginTimer = setTimeout(() => {
            qrLogin()
          }, 2000)
          break
        case 2: // 登录成功
          clearQRLoginInfo()
          if (qrLoginTimer) {
            clearTimeout(qrLoginTimer)
            qrLoginTimer = null
          }
          loginSuccess(response.result.token.accessToken, response.result.token.refreshToken)
          break
        case 3: // 取消登录
          clearQRLoginInfo()
          if (qrLoginTimer) {
            clearTimeout(qrLoginTimer)
            qrLoginTimer = null
          }
          ElMessage.warning('登录已取消')
          break
        default:
          clearQRLoginInfo()
          if (qrLoginTimer) {
            clearTimeout(qrLoginTimer)
            qrLoginTimer = null
          }
          break
      }
    } else {
      clearQRLoginInfo()
      if (qrLoginTimer) {
        clearTimeout(qrLoginTimer)
        qrLoginTimer = null
      }
    }
  }).catch((error: any) => {
    console.error('查询登录状态失败:', error)
    // 如果是429错误，延长等待时间
    if (error.response?.status === 429) {
      ElMessage.warning('请求过于频繁，请稍后再试')
      qrLoginTimer = setTimeout(() => {
        qrLogin()
      }, 5000) // 5秒后重试
    } else {
      clearQRLoginInfo()
      if (qrLoginTimer) {
        clearTimeout(qrLoginTimer)
        qrLoginTimer = null
      }
    }
  })
}

const loginSuccess = (accessToken: string, refreshToken: string) => {
  ElMessage.success('登录成功')
  setStore('accessToken', accessToken)
  setStore('refreshToken', refreshToken)
  userInfo().then((res: any) => {
    if (res.success) {
      Cookies.set('userInfoManager', JSON.stringify(res.result))
      appStore.setAvatarPath(res.result.avatar)
      util.initRouter(router)
      router.push({
        name: 'home_index'
      })
    }
  })
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

    > div:nth-child(2) {
      color: $theme_color;
      cursor: pointer;
      font-size: 14px;
    }

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

.qr-login-content {
  .qr-container {
    text-align: center;
    margin: 20px 0;
    position: relative;

    .qr-shadow {
      background: rgba(0, 0, 0, 0.45);
      position: absolute;
      left: 50%;
      margin-left: -75px;
      top: 0;
      z-index: 99;
      width: 150px;
      height: 150px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      color: #fff;

      span {
        margin-bottom: 20px;
        font-size: 13px;
        letter-spacing: 2px;
      }
    }
  }

  .drag-area {
    margin: 10px 0;
  }
}

.pending-scan {
  text-align: center;
  color: black;
}

.scanned {
  text-align: center;
  color: green;
}

.quick-logining {
  text-align: center;
  color: red;
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

