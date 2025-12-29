import { getRequest, postRequest, putRequest, deleteRequest } from '@/libs/axios'

// 获取系统设置
// 注意：baseURL 已经包含 /api/manager，所以这里不需要再添加 /manager 前缀
export const getSystemSettings = () => {
  return getRequest('/setting/system')
}

// 更新系统设置
export const updateSystemSettings = (params: any) => {
  return putRequest('/setting/system', params)
}

// 获取邮件设置
export const getEmailSettings = () => {
  return getRequest('/setting/email')
}

// 更新邮件设置
export const updateEmailSettings = (params: any) => {
  return putRequest('/setting/email', params)
}

// 获取支付设置
export const getPaymentSettings = () => {
  return getRequest('/setting/system/payment')
}

// 更新支付设置
export const updatePaymentSettings = (params: any) => {
  return putRequest('/setting/system/payment', params)
}

