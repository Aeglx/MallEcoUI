import Cookies from 'js-cookie'

/**
 * 存储工具类
 * 使用 Cookie 存储，支持域名解析
 */
export default {
  setItem: (key: string, value: any, options: any = {}) => {
    if (typeof window !== 'undefined') {
      // 域名解析（如果需要）
      // const psl = require('psl')
      // const pPsl = psl.parse(document.domain)
      // let domain = pPsl.domain
      // if (/\d+\.\d+\.\d+\.\d+/.test(pPsl.input)) domain = pPsl.input
      // options = { domain, ...options }
      Cookies.set(key, value, options)
    }
  },
  getItem: (key: string): string => {
    if (typeof window !== 'undefined') {
      return Cookies.get(key) || ''
    }
    return ''
  },
  removeItem: (key: string, options: any = {}) => {
    if (typeof window !== 'undefined') {
      // const psl = require('psl')
      // const pPsl = psl.parse(document.domain)
      // let domain = pPsl.domain
      // if (/\d+\.\d+\.\d+\.\d+/.test(pPsl.input)) domain = pPsl.input
      // options = { domain, ...options }
      Cookies.remove(key, options)
    }
  }
}

