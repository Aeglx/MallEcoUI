<template>
  <div class="main">
    <!-- 左侧菜单 -->
    <div class="sidebar-menu-con menu-bar">
      <div class="logo-con">
        <img :src="domainLogo" key="max-logo" alt="logo" />
      </div>
      <ShrinkableMenu />
    </div>
    <!-- 顶部标题栏主体 -->
    <div
      class="main-header-con"
      :style="{ height: setting.isUseTabsRouter ? '100px' : '60px' }"
    >
      <div class="main-header">
        <div class="header-avator-con">
          <div></div>
          <div class="flex flex-a-c user-module">
            <!-- 通知消息 -->
            <MessageTip v-if="tipsMessage" :res="tipsMessage" />
            <!-- 用户头像 -->
            <div class="user-dropdown-menu-con">
              <div class="user-dropdown-innercon" style="display: flex; align-items: center; justify-content: flex-end;">
                <ul class="nav-list">
                  <li class="nav-item" @click="handleClickSetting">
                    <el-tooltip content="设置" placement="bottom">
                      <el-icon :size="16" style="cursor: pointer;">
                        <Setting />
                      </el-icon>
                    </el-tooltip>
                  </li>
                </ul>
                <el-dropdown trigger="hover" @command="handleClickUserDropdown">
                  <div class="dropList">
                    <span class="main-user-name">{{ userInfo.nickName || userInfo.nickname || '管理员' }}</span>
                    <el-avatar
                      :src="avatarPath"
                      style="background: #fff; margin-left: 10px; flex-shrink: 0; width: 32px; height: 32px;"
                    >
                      <el-icon><User /></el-icon>
                    </el-avatar>
                  </div>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item command="personalCenter">
                        {{ $t('userCenter') }}
                      </el-dropdown-item>
                      <el-dropdown-item command="changePass">
                        {{ $t('changePass') }}
                      </el-dropdown-item>
                      <el-dropdown-item divided command="loginOut">
                        {{ $t('logout') }}
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 已打开的页面标签 -->
      <div class="tags-con" v-if="setting.isUseTabsRouter">
        <TagsPageOpened :pageTagsList="pageTagsList" />
      </div>
    </div>
    <div
      class="single-page-con"
      :style="{
        top: setting.isUseTabsRouter ? '100px' : '60px',
        height: setting.isUseTabsRouter ? 'calc(100% - 110px)' : 'calc(100% - 70px)'
      }"
    >
      <div class="single-page">
        <router-view />
      </div>
    </div>
    <!-- 全局加载动画 -->
    <CircleLoading class="loading-position" v-show="loading" />
    <!-- 右侧抽屉配置 -->
    <ConfigDrawer ref="configDrawerRef" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAppStore } from '@/stores/app'
import { useSettingStore } from '@/stores/setting'
import { useUserStore } from '@/stores/user'
import { Setting, User } from '@element-plus/icons-vue'
import ShrinkableMenu from './main-parts/shrinkable-menu/shrinkable-menu.vue'
import TagsPageOpened from './main-parts/tags-page-opened.vue'
import MessageTip from './main-parts/message-tip.vue'
import CircleLoading from '@/components/malleco/circle-loading.vue'
import ConfigDrawer from '@/components/malleco/config-drawer.vue'
import Cookies from 'js-cookie'
import util from '@/libs/util'
import { getNoticePage, logout } from '@/api/index'
import { getBaseSite } from '@/api/common'
import { setStore } from '@/libs/storage'
import config from '@/config'
import './main.scss'

declare const BASE: any

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const appStore = useAppStore()
const settingStore = useSettingStore()
const userStore = useUserStore()

const configDrawerRef = ref()
const sliceNum = ref(5) // 展示nav数量
const userInfo = ref<any>('') // 用户信息
const tipsMessage = ref<any>('') // 通知消息
const domainLogo = ref('') // 域名logo

const setting = computed(() => settingStore.setting)
const loading = computed(() => appStore.loading)
const pageTagsList = computed(() => appStore.pageOpenedList)
const avatarPath = computed(() => localStorage.getItem('avatorImgPath') || '')

const handleClickSetting = () => {
  configDrawerRef.value?.open()
}

const init = () => {
  // 菜单初始化
  const userInfoStr = Cookies.get('userInfoManager')
  if (userInfoStr) {
    userInfo.value = JSON.parse(userInfoStr)
  }

  checkTag(route.name as string)

  const currWidth = document.body.clientWidth
  if (currWidth <= 1200) {
    sliceNum.value = 2
  }

  // 从网络获取 Logo
  fetchLogo()
  
  // 设置页面标题和图标
  const link =
    document.querySelector("link[rel*='icon']") || document.createElement('link')
  link.setAttribute('type', 'image/x-icon')
  link.setAttribute('rel', 'shortcut icon')
  document.getElementsByTagName('head')[0].appendChild(link)
  
  // 从localStorage获取标题（如果有的话）
  const title = localStorage.getItem('title')
  if (title) {
    window.document.title = title + ' - 运营后台'
  }

  // 读取未读消息数 - 添加延迟避免与首页同时请求
  setTimeout(() => {
    getNoticePage({})
      .then((res: any) => {
        if (res.success) {
          tipsMessage.value = res.result
        }
      })
      .catch((error) => {
        console.error('获取通知消息失败:', error)
      })
  }, 500)
}

// 用户头像下方抽屉点击
const handleClickUserDropdown = (name: string) => {
  // 个人中心
  if (name === 'personalCenter') {
    util.openNewPage({}, 'personal-center')
    router.push({
      name: 'personal-center'
    })
  }
  // 修改密码
  else if (name === 'changePass') {
    util.openNewPage({}, 'change-password')
    router.push({
      name: 'change_password'
    })
  }
  // 退出登录
  else if (name === 'loginOut') {
    logout().then((res: any) => {
      userStore.logout()
      appStore.setAdded(false)
      setStore('accessToken', '')
      setStore('refreshToken', '')
      router.push({ path: '/login' })
    })
  }
}

// 切换标签
const checkTag = (name: string) => {
  const openpageHasTag = pageTagsList.value.some((item) => {
    return item.name === name
  })
  if (!openpageHasTag) {
    // 解决关闭当前标签后再点击回退按钮会退到当前页时没有标签的问题
    util.openNewPage({}, name, route.params || {}, route.query || {})
  }
}

// 宽度动态计算
const resize = () => {
  const currWidth = document.body.clientWidth
  const count = currWidth / 300
  if (count > 6) {
    sliceNum.value = 6
  } else {
    sliceNum.value = count
  }
}

// 监听路由变化
watch(
  () => route.name,
  (to) => {
    if (to) {
      checkTag(to as string)
      localStorage.setItem('currentPageName', to as string)
    }
  }
)

// 构建完整的 Logo URL
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
          domainLogo.value = buildLogoUrl(logoPath)
          // 同时更新 favicon
          const link = document.querySelector("link[rel*='icon']") as HTMLLinkElement
          if (link) {
            link.href = domainLogo.value
          }
        }
      }
    })
    .catch((error: any) => {
      // 静默处理错误，避免在开发环境显示网络错误
      if (error.code !== 'ERR_NETWORK' && error.code !== 'ERR_CONNECTION_REFUSED') {
        console.warn('[Logo] 获取失败:', error.message)
      }
    })
}

onMounted(() => {
  init()
  resize()
  window.addEventListener('resize', resize)
  // 显示打开的页面的列表
  appStore.setOpenedList({
    title: '首页',
    path: '',
    name: 'home_index'
  })
})
</script>

