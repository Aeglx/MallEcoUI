import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { ElMessage } from 'element-plus'
import storage from '@/utils/storage'
import { v4 as uuidv4 } from 'uuid'
import qs from 'qs'

// 统一请求路径前缀
declare const BASE: any

export const buyerUrl =
  import.meta.env.MODE === 'development' ? BASE.API_DEV.buyer : BASE.API_PROD.buyer

export const commonUrl =
  import.meta.env.MODE === 'development' ? BASE.API_DEV.common : BASE.API_PROD.common

const service = axios.create({
  timeout: 10000,
  baseURL: buyerUrl,
  paramsSerializer: (params) =>
    qs.stringify(params, {
      arrayFormat: 'repeat'
    })
})

let isRefreshToken = 0

// 请求拦截器
service.interceptors.request.use(
  (config: any) => {
    // 获取UUID
    let uuid = storage.getItem('uuid')
    if (!uuid) {
      uuid = uuidv4()
      storage.setItem('uuid', uuid)
    }
    config.headers['uuid'] = uuid

    // 获取访问Token
    const accessToken = storage.getItem('accessToken')
    if (accessToken && config.needToken !== false) {
      config.headers['accessToken'] = accessToken
    }

    // POST/PUT 请求参数序列化
    const isPutPost = config.method === 'put' || config.method === 'post'
    const isJson = config.headers['Content-Type'] === 'application/json'
    const isFile = config.headers['Content-Type'] === 'multipart/form-data'

    if (isPutPost && isJson) {
      config.data = JSON.stringify(config.data)
    } else if (isPutPost && !isFile && !isJson) {
      config.data = qs.stringify(config.data, {
        arrayFormat: 'repeat'
      })
    }

    return config
  },
  (error) => {
    ElMessage.error('请求超时')
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    const data = response.data

    // 根据返回的code值来做不同的处理
    if (!data.success && data.message) {
      ElMessage.error(data.message)
    }

    switch (data.code) {
      case 400:
        if (data.message !== null) {
          ElMessage.error(data.message)
        } else {
          ElMessage.error('系统异常')
        }
        break
      case 20004:
      case 401:
        // 未登录，清除已登录状态
        storage.removeItem('accessToken')
        storage.removeItem('userInfo')
        // 路由跳转在 router 中处理
        return data
      case 500:
        if (data.message !== null) {
          ElMessage.error(data.message)
        } else {
          ElMessage.error('系统异常')
        }
        break
      default:
        return data
    }
    return data
  },
  async (error: any) => {
    // 返回状态码不为200时候的错误处理
    if (error.response) {
      if (error.response.status === 401) {
        // 未登录
        storage.removeItem('accessToken')
        storage.removeItem('userInfo')
      } else if (error.response.status === 404) {
        ElMessage.error('请求的资源不存在')
      } else if (error.response.status === 500) {
        ElMessage.error('服务器错误')
      } else {
        ElMessage.error(error.response.data?.message || '请求失败')
      }
    } else {
      // 网络错误或连接被拒绝（后端未启动）时，静默处理
      // 不显示错误消息，让页面可以正常加载
      if (error.code !== 'ERR_NETWORK' && error.code !== 'ECONNREFUSED') {
        ElMessage.error('网络错误，请检查网络连接')
      }
    }
    return Promise.reject(error)
  }
)

// 请求方法
export const getRequest = (url: string, params?: any, config?: any) => {
  const finalConfig: any = { params, ...config }
  if (config?.needToken !== undefined) {
    finalConfig.needToken = config.needToken
  }
  // 如果指定了baseURL，临时修改axios实例的baseURL
  if (config?.baseURL) {
    const originalBaseURL = service.defaults.baseURL
    service.defaults.baseURL = config.baseURL
    const promise = service.get(url, finalConfig).finally(() => {
      // 恢复原始baseURL
      service.defaults.baseURL = originalBaseURL
    })
    return promise
  }
  return service.get(url, finalConfig)
}

export const postRequest = (url: string, params?: any, config?: any) => {
  const finalConfig: any = { ...config }
  if (config?.needToken !== undefined) {
    finalConfig.needToken = config.needToken
  }
  // 如果指定了baseURL，临时修改axios实例的baseURL
  if (config?.baseURL) {
    const originalBaseURL = service.defaults.baseURL
    service.defaults.baseURL = config.baseURL
    const promise = service.post(url, params, finalConfig).finally(() => {
      // 恢复原始baseURL
      service.defaults.baseURL = originalBaseURL
    })
    return promise
  }
  return service.post(url, params, finalConfig)
}

export const putRequest = (url: string, params?: any, config?: any) => {
  const finalConfig = { ...config }
  if (config?.needToken !== undefined) {
    ;(finalConfig as any).needToken = config.needToken
  }
  return service.put(url, params, finalConfig)
}

export const patchRequest = (url: string, params?: any, config?: any) => {
  const finalConfig = { ...config }
  if (config?.needToken !== undefined) {
    ;(finalConfig as any).needToken = config.needToken
  }
  return service.patch(url, params, finalConfig)
}

export const deleteRequest = (url: string, params?: any, config?: any) => {
  const finalConfig = { params, ...config }
  if (config?.needToken !== undefined) {
    ;(finalConfig as any).needToken = config.needToken
  }
  return service.delete(url, finalConfig)
}

// Token刷新函数（防抖）
function getTokenDebounce() {
  let timer: NodeJS.Timeout | null = null
  return async () => {
    if (timer) {
      clearTimeout(timer)
    }
    return new Promise((resolve) => {
      timer = setTimeout(async () => {
        // TODO: 实现token刷新逻辑
        resolve('success')
      }, 300)
    })
  }
}

export default service

