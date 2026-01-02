import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import storage from '@/utils/storage'
import { getMemberMsg, logout as apiLogout } from '@/api/login'

export const useUserStore = defineStore('user', () => {
  const userInfo = ref<any>(null)
  const token = ref<string>('')

  // 初始化用户信息
  const initUserInfo = () => {
    const storedUserInfo = storage.getItem('userInfo')
    const storedToken = storage.getItem('accessToken')
    
    if (storedUserInfo) {
      try {
        userInfo.value = typeof storedUserInfo === 'string' 
          ? JSON.parse(storedUserInfo) 
          : storedUserInfo
      } catch (e) {
        console.error('解析用户信息失败:', e)
        userInfo.value = null
      }
    }
    
    if (storedToken) {
      token.value = storedToken
    }
  }

  // 设置用户信息
  const setUserInfo = (info: any) => {
    userInfo.value = info
    storage.setItem('userInfo', JSON.stringify(info))
  }

  // 设置Token
  const setToken = (accessToken: string, refreshToken?: string) => {
    token.value = accessToken
    storage.setItem('accessToken', accessToken)
    if (refreshToken) {
      storage.setItem('refreshToken', refreshToken)
    }
  }

  // 获取用户信息
  const fetchUserInfo = async () => {
    try {
      const res = await getMemberMsg()
      const data = res.data || res
      if (data.success && data.result) {
        setUserInfo(data.result)
        return data.result
      }
    } catch (error) {
      console.error('获取用户信息失败:', error)
    }
  }

  // 退出登录
  const logout = async () => {
    try {
      await apiLogout()
    } catch (error) {
      console.error('退出登录失败:', error)
    } finally {
      userInfo.value = null
      token.value = ''
      storage.removeItem('accessToken')
      storage.removeItem('refreshToken')
      storage.removeItem('userInfo')
    }
  }

  // 是否已登录
  const isLoggedIn = computed(() => {
    return !!token.value && !!userInfo.value
  })

  // 用户名
  const username = computed(() => {
    return userInfo.value?.username || userInfo.value?.nickName || ''
  })

  // 用户头像
  const avatar = computed(() => {
    return userInfo.value?.face || ''
  })

  // 初始化
  initUserInfo()

  return {
    userInfo,
    token,
    isLoggedIn,
    username,
    avatar,
    setUserInfo,
    setToken,
    fetchUserInfo,
    logout,
    initUserInfo
  }
})

