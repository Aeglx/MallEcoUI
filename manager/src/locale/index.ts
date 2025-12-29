import { createI18n } from 'vue-i18n'
import zhLocale from './lang/zh-CN'
import enLocale from './lang/en-US'

// 根据浏览器信息自动设置语言
const navLang = navigator.language
const localLang = navLang === 'zh-CN' || navLang === 'en-US' ? navLang : false
const lang = window.localStorage.getItem('lang') || localLang || 'zh-CN'

const messages = {
  'zh-CN': zhLocale,
  'en-US': enLocale
}

const i18n = createI18n({
  locale: lang as string,
  messages,
  legacy: false // 使用 Composition API 模式
})

export default i18n

