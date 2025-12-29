<template>
  <div>
    <el-row class="header">
      <img :src="domainLogo" class="logo" width="220px" alt="logo" />
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getBaseSite } from '@/api/common'
import logoImg from '@/assets/logo.png'

declare const BASE: any

const domainLogo = ref(logoImg)

// 处理 logo URL，如果是相对路径则拼接完整 URL
// 强制使用本地后端 logo，忽略网络 CDN 地址
const processLogoUrl = (logo: string): string => {
  if (!logo) return logoImg
  
  // 如果是网络地址（CDN），强制使用本地后端 logo
  if (logo.startsWith('http')) {
    // 返回本地后端 logo 路径
    const baseUrl = import.meta.env.MODE === 'development' 
      ? BASE.API_DEV.common.replace('/api', '')
      : BASE.API_PROD.common.replace('/api', '')
    return `${baseUrl}/logo.png`
  }
  
  // 如果是相对路径，拼接后端地址
  if (logo.startsWith('/')) {
    const baseUrl = import.meta.env.MODE === 'development' 
      ? BASE.API_DEV.common.replace('/api', '')
      : BASE.API_PROD.common.replace('/api', '')
    return `${baseUrl}${logo}`
  }
  return logo
}

const init = () => {
  if (
    !localStorage.getItem('icon') ||
    !localStorage.getItem('title') ||
    !localStorage.getItem('icontitle_expiration_time')
  ) {
    getSite()
  } else {
    // 如果缓存过期，则获取最新的信息
    const expirationTime = localStorage.getItem('icontitle_expiration_time')
    if (expirationTime && new Date() > new Date(expirationTime)) {
      getSite()
      return
    } else {
      const cachedLogo = localStorage.getItem('icon') || ''
      domainLogo.value = processLogoUrl(cachedLogo)
      const link =
        document.querySelector("link[rel*='icon']") || document.createElement('link')
      link.setAttribute('type', 'image/x-icon')
      link.setAttribute('href', localStorage.getItem('domainIcon') || '')
      link.setAttribute('rel', 'shortcut icon')
      document.getElementsByTagName('head')[0].appendChild(link)
      window.document.title = localStorage.getItem('title') + ' - 运营后台'
    }
  }
}

const getSite = () => {
  // 获取domainLogo
  getBaseSite().then((res: any) => {
    const { domainLogo: logo, domainIcon, siteName } = JSON.parse(res.result.settingValue)
    // 处理 logo URL - 强制使用本地后端 logo
    const logoUrl = processLogoUrl(logo)
    domainLogo.value = logoUrl
    // 过期时间
    const expirationTime = new Date().setHours(new Date().getHours() + 1)
    // 存放过期时间
    localStorage.setItem('icontitle_expiration_time', new Date(expirationTime).toString())
    localStorage.setItem('icon', logo)
    localStorage.setItem('domainIcon', domainIcon)
    localStorage.setItem('title', siteName)

    const link =
      document.querySelector("link[rel*='icon']") || document.createElement('link')
    link.setAttribute('type', 'image/x-icon')
    link.setAttribute('href', domainIcon)
    link.setAttribute('rel', 'shortcut icon')
    document.getElementsByTagName('head')[0].appendChild(link)
    window.document.title = siteName + ' - 运营后台'
  })
}

onMounted(() => {
  init()
})
</script>

<style scoped lang="scss">
.header {
  text-align: center;
  padding: 20px 0;
}
.logo {
  max-width: 220px;
  height: auto;
}
</style>

