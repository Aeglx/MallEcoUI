import { getRequest, postRequest } from '@/libs/axios'

// 统一请求路径前缀
declare const BASE: any

export const commonUrl =
  import.meta.env.MODE === 'development' ? BASE.API_DEV.common : BASE.API_PROD.common

/**
 * 获取基础站点信息
 */
export function getBaseSite() {
  return getRequest('/common/common/site', {}, {
    needToken: false,
    baseURL: commonUrl
  }).catch((error: any) => {
    // 后端未启动时返回空结果，不阻塞页面
    if (error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED') {
      return Promise.resolve({ success: false, result: null })
    }
    return Promise.reject(error)
  })
}

/**
 * 获取拼图验证
 */
export function getVerifyImg(verificationEnums: string) {
  return getRequest('/common/common/slider/' + verificationEnums, {}, {
    needToken: false,
    baseURL: commonUrl
  })
}

/**
 * 验证码校验
 */
export function postVerifyImg(params: any) {
  return postRequest('/common/common/slider/' + params.verificationEnums, params, {
    needToken: false,
    baseURL: commonUrl
  })
}

/**
 * 发送短信验证码
 */
export function sendSms(params: { mobile: string; verificationEnums: string }) {
  return getRequest(
    `/common/common/sms/${params.verificationEnums}/${params.mobile}`,
    {},
    {
      needToken: false,
      baseURL: commonUrl
    }
  )
}

/**
 * 地区数据，用于三级联动
 */
export function getRegion(id: string) {
  return getRequest(`/common/common/region/item/${id}`, {}, {
    baseURL: commonUrl
  })
}

/**
 * 分页获取文章列表
 */
export function articleList(params: any) {
  return getRequest('/buyer/other/article', params)
}

/**
 * 获取帮助中心文章分类列表
 */
export function articleCateList() {
  return getRequest('/buyer/other/article/articleCategory/list')
}

/**
 * 通过id获取文章
 */
export function articleDetail(id: string) {
  return getRequest(`/buyer/other/article/get/${id}`)
}

/**
 * 获取IM接口前缀
 */
export function getIMDetail() {
  return getRequest('/common/common/IM', {}, {
    baseURL: commonUrl
  })
}

/**
 * 图片上传
 */
export function uploadImage(file: File) {
  const formData = new FormData()
  formData.append('file', file)
  return postRequest('/common/common/upload/file', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    needToken: true,
    baseURL: commonUrl
  })
}
