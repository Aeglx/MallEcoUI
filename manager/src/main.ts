import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import i18n from './locale'
// 使用 Element Plus 替代 view-design
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import './styles/theme.less'
import './styles/common.scss'

import { getRequest, postRequest, putRequest, deleteRequest, importRequest, uploadFileRequest } from '@/libs/axios'
import { setStore, getStore, removeStore } from '@/libs/storage'
import { md5 } from '@/utils/md5'
import config from '@/config'
import mallecoDialog from '@/components/malleco-dialog'

// 全局配置
const { aMapSecurityJsCode, inputMaxLength, mainColor } = config

// 高德安全密钥
if (aMapSecurityJsCode) {
  ;(window as any)._AMapSecurityConfig = {
    securityJsCode: aMapSecurityJsCode
  }
}

// 创建应用实例
const app = createApp(App)

// 使用插件
app.use(createPinia())
app.use(router)
app.use(i18n)
// Element Plus 配置
app.use(ElementPlus, {
  locale: zhCn,
  size: 'default'
})
// 注册所有图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 全局属性
declare const BASE: any
const PC_URL = BASE?.PC_URL || ''
const WAP_URL = BASE?.WAP_URL || ''

// 扩展全局属性类型
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    linkTo: (goodsId: string, skuId?: string) => void
    wapLinkTo: (goodsId: string, skuId?: string) => string
    getRequest: typeof getRequest
    postRequest: typeof postRequest
    putRequest: typeof putRequest
    deleteRequest: typeof deleteRequest
    importRequest: typeof importRequest
    uploadFileRequest: typeof uploadFileRequest
    setStore: typeof setStore
    getStore: typeof getStore
    removeStore: typeof removeStore
    $mainColor: string
    md5: typeof md5
  }
}

app.config.globalProperties.linkTo = function (goodsId: string, skuId?: string) {
  // 跳转买家端商品
  let src = ''
  if (skuId) {
    src = `${PC_URL}/goodsDetail?skuId=${skuId}&goodsId=${goodsId}`
  } else {
    src = `${PC_URL}/goodsDetail?goodsId=${goodsId}`
  }
  window.open(src, '_blank')
}

app.config.globalProperties.wapLinkTo = function (goodsId: string, skuId?: string) {
  // app端二维码
  if (skuId) {
    return `${WAP_URL}/pages/product/goods?id=${skuId}&goodsId=${goodsId}`
  } else {
    return `${WAP_URL}/pages/product/goods?goodsId=${goodsId}`
  }
}

app.config.globalProperties.getRequest = getRequest
app.config.globalProperties.postRequest = postRequest
app.config.globalProperties.putRequest = putRequest
app.config.globalProperties.deleteRequest = deleteRequest
app.config.globalProperties.importRequest = importRequest
app.config.globalProperties.uploadFileRequest = uploadFileRequest
app.config.globalProperties.setStore = setStore
app.config.globalProperties.getStore = getStore
app.config.globalProperties.removeStore = removeStore
app.config.globalProperties.$mainColor = mainColor
app.config.globalProperties.md5 = md5

// Array 扩展
declare global {
  interface Array<T> {
    remove(from: number, to?: number): T[]
  }
}

Array.prototype.remove = function <T>(from: number, to?: number): T[] {
  const rest = this.slice((to || from) + 1 || this.length)
  this.length = from < 0 ? this.length + from : from
  return this.push.apply(this, rest)
}

// 注册全局组件
app.component('mallecoDialog', mallecoDialog)

// 挂载应用
app.mount('#app')

