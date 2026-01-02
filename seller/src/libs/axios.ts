import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { getStore, setStore } from './storage'
import { ElMessage } from 'element-plus'
import Cookies from 'js-cookie'
import { v4 as uuidv4 } from 'uuid'

// 统一请求路径前缀
declare const BASE: any

export const commonUrl =
  import.meta.env.MODE === 'development' ? BASE.API_DEV.common : BASE.API_PROD.common

export const sellerUrl =
  (import.meta.env.MODE === 'development' ? BASE.API_DEV.seller : BASE.API_PROD.seller) +
  BASE.PREFIX

// 文件上传接口
export const uploadFile = commonUrl + '/common/common/upload/file'

const service = axios.create({
  timeout: 8000,
  baseURL: sellerUrl
})

let isRefreshToken = 0
const refreshToken = getTokenDebounce()

// 请求拦截器
service.interceptors.request.use(
  (config: any) => {
    if (config.method === 'get') {
      config.params = {
        _t: Date.parse(new Date()) / 1000,
        ...config.params
      }
    }
    let uuid = getStore('uuid')
    if (!uuid) {
      uuid = uuidv4()
      setStore('uuid', uuid)
    }
    config.headers['uuid'] = uuid
    return config
  },
  (err) => {
    ElMessage.error('请求超时')
    return Promise.reject(err)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    const data = response.data
    // 根据返回的code值来做不同的处理(和后端约定)
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
        // 未登录 清除已登录状态
        Cookies.set('userInfoSeller', '')
        setStore('accessToken', '')
        // 路由跳转在 router 中处理
        return data
      case 500:
        // 系统异常
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
        // 这种情况一般调到登录页
      } else if (error.response.status === 404) {
        // 避免刷新token报错
      } else if (error.response.status === 403 || error.response.data?.code === 20004) {
        isRefreshToken++
        if (isRefreshToken === 1) {
          const getTokenRes = await refreshToken()
          if (getTokenRes === 'success') {
            // 刷新token
            if (isRefreshToken === 1) {
              error.response.config.headers.accessToken = getStore('accessToken')
              return service(error.response.config)
            }
          } else {
            Cookies.set('userInfoSeller', '')
            // 路由跳转在 router 中处理
          }
          isRefreshToken = 0
        }
      } else {
        // 其他错误处理
        ElMessage.error(error.response.data?.message || '请求失败')
      }
    }
    return Promise.resolve(error)
  }
)

// 防抖闭包来一波
function getTokenDebounce() {
  let lock = false
  let success = false
  return function () {
    if (!lock) {
      lock = true
      const oldRefreshToken = getStore('refreshToken')
      // 动态导入避免循环依赖
      import('../api/index').then(({ handleRefreshToken }) => {
        handleRefreshToken(oldRefreshToken)
          .then((res: any) => {
            if (res.success) {
              const { accessToken, refreshToken } = res.result
              setStore('accessToken', accessToken)
              setStore('refreshToken', refreshToken)
              success = true
              lock = false
            } else {
              success = false
              lock = false
            }
          })
          .catch(() => {
            success = false
            lock = false
          })
      })
    }
    return new Promise<string>((resolve) => {
      // 一直看lock,直到请求失败或者成功
      const timer = setInterval(() => {
        if (!lock) {
          clearInterval(timer)
          if (success) {
            resolve('success')
          } else {
            resolve('fail')
          }
        }
      }, 500) // 轮询时间间隔
    })
  }
}

export const getRequest = (url: string, params?: any, resBlob?: string) => {
  const accessToken = getStore('accessToken')
  const config: AxiosRequestConfig = {
    method: 'get',
    url: `${url}`,
    params: params,
    headers: {
      accessToken: accessToken
    }
  }
  if (resBlob === 'blob') {
    config.responseType = 'blob'
  }
  return service(config)
}

export const postRequest = (url: string, params?: any, headers?: any) => {
  const accessToken = getStore('accessToken')
  return service({
    method: 'post',
    url: `${url}`,
    data: params,
    transformRequest: headers
      ? undefined
      : [
          function (data: any) {
            let ret = ''
            for (const it in data) {
              ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
            }
            ret = ret.substring(0, ret.length - 1)
            return ret
          }
        ],
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      accessToken: accessToken,
      ...headers
    }
  })
}

/** 不带form表单不带transformRequest */
export const postRequestWithNoForm = (url: string, params?: any) => {
  const accessToken = getStore('accessToken')
  return service({
    method: 'post',
    url: `${url}`,
    data: params,
    headers: {
      accessToken: accessToken
    }
  })
}

export const putRequest = (url: string, params?: any, headers?: any) => {
  const accessToken = getStore('accessToken')
  return service({
    method: 'put',
    url: `${url}`,
    data: params,
    transformRequest: headers
      ? undefined
      : [
          function (data: any) {
            let ret = ''
            for (const it in data) {
              ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
            }
            ret = ret.substring(0, ret.length - 1)
            return ret
          }
        ],
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      accessToken: accessToken,
      ...headers
    }
  })
}

export const putRequestWithNoForm = (url: string, params?: any) => {
  const accessToken = getStore('accessToken')
  return service({
    method: 'put',
    url: `${url}`,
    data: params,
    headers: {
      accessToken: accessToken
    }
  })
}

export const patchRequest = (url: string, params?: any, headers?: any) => {
  const accessToken = getStore('accessToken')
  return service({
    method: 'patch',
    url: `${url}`,
    data: params,
    transformRequest: headers
      ? undefined
      : [
          function (data: any) {
            let ret = ''
            for (const it in data) {
              ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
            }
            ret = ret.substring(0, ret.length - 1)
            return ret
          }
        ],
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      accessToken: accessToken,
      ...headers
    }
  })
}

export const patchRequestWithNoForm = (url: string, params?: any) => {
  const accessToken = getStore('accessToken')
  return service({
    method: 'patch',
    url: `${url}`,
    data: params,
    headers: {
      accessToken: accessToken
    }
  })
}

export const deleteRequest = (url: string, params?: any) => {
  const accessToken = getStore('accessToken')
  return service({
    method: 'delete',
    url: `${url}`,
    params: params,
    headers: {
      accessToken: accessToken
    }
  })
}

export const importRequest = (url: string, params?: any) => {
  const accessToken = getStore('accessToken')
  return service({
    method: 'post',
    url: `${url}`,
    data: params,
    headers: {
      accessToken: accessToken
    }
  })
}

export const uploadFileRequest = (url: string, params?: any) => {
  const accessToken = getStore('accessToken')
  return service({
    method: 'post',
    url: `${url}`,
    data: params,
    headers: {
      accessToken: accessToken,
      'Content-Type': 'multipart/form-data'
    }
  })
}

/**
 * 无需token验证的请求 避免旧token过期导致请求失败
 */
export const getRequestWithNoToken = (url: string, params?: any, config?: any) => {
  return service({
    method: 'get',
    url: `${url}`,
    params: params,
    ...config
  })
}

/**
 * 无需token验证的请求 避免旧token过期导致请求失败
 */
export const postRequestWithNoToken = (url: string, params?: any) => {
  return service({
    method: 'post',
    url: `${url}`,
    params: params
  })
}

/**
 * 无需token验证的请求 避免旧token过期导致请求失败
 */
export const postRequestWithNoTokenData = (url: string, params?: any, config?: any) => {
  // 判断是否为FormData
  const isFormData = params instanceof FormData
  const headers: any = {
    ...(config?.headers || {})
  }

  // 如果是FormData，让浏览器自动设置Content-Type（包含boundary）
  // 否则使用application/json（NestJS默认支持JSON解析）
  if (!isFormData) {
    headers['Content-Type'] = 'application/json'
  }

  return service({
    method: 'post',
    url: `${url}`,
    headers,
    data: params,
    ...(config ? { ...config, headers: undefined } : {})
  })
}

