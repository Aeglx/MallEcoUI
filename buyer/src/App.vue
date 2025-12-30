<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { getBaseSite } from '@/api/common'
import storage from '@/utils/storage'

onMounted(() => {
  init()
})

const init = async () => {
  // 检查缓存
  const siteName = storage.getItem('siteName')
  const logoImg = storage.getItem('logoImg')
  const expirationTime = storage.getItem('sitelogo_expiration_time')

  if (!siteName || !logoImg || !expirationTime) {
    await getSite()
  } else {
    // 检查是否过期（1小时）
    if (new Date() > new Date(expirationTime)) {
      await getSite()
    } else {
      updateSiteInfo(siteName, storage.getItem('logoImg'), storage.getItem('siteIcon'))
    }
  }
}

const getSite = async () => {
  try {
    const res = await getBaseSite()
    const data = res.data || res
    if (data.success && data.result?.settingValue) {
      const siteData = typeof data.result.settingValue === 'string' 
        ? JSON.parse(data.result.settingValue) 
        : data.result.settingValue
      
      // 过期时间（1小时后）
      const expirationTime = new Date().setHours(new Date().getHours() + 1)
      
      // 存储信息
      storage.setItem('sitelogo_expiration_time', expirationTime.toString())
      storage.setItem('siteName', siteData.siteName)
      storage.setItem('logoImg', siteData.buyerSideLogo)
      storage.setItem('siteIcon', siteData.buyerSideIcon)
      
      updateSiteInfo(siteData.siteName, siteData.buyerSideLogo, siteData.buyerSideIcon)
    }
  } catch (error) {
    console.error('获取站点信息失败:', error)
  }
}

const updateSiteInfo = (siteName: string, logoImg: string, siteIcon: string) => {
  document.title = siteName || 'MallEco 购物商城'
  
  // 更新 favicon
  let link = document.querySelector("link[rel*='icon']") as HTMLLinkElement || document.createElement('link')
  link.type = 'image/x-icon'
  link.href = siteIcon || '/favicon.ico'
  link.rel = 'shortcut icon'
  document.getElementsByTagName('head')[0].appendChild(link)
}
</script>

<style lang="scss">
#app {
  min-height: 100vh;
}
</style>

