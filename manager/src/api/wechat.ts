// 微信相关 API
// 注意：wechat 控制器不在 manager 模块下，路径是 /api/admin/wechat/*
import { getApiRequest, postApiRequest, putApiRequest, deleteApiRequest } from '@/libs/axios'

// ========== 微信概览 ==========
// 获取公众号概览
export const getWechatOverview = () => {
  return getApiRequest('/admin/wechat/overview')
}

// 获取公众号配置
export const getWechatConfig = () => {
  return getApiRequest('/admin/wechat/config')
}

// 更新公众号配置
export const updateWechatConfig = (params: any) => {
  return postApiRequest('/admin/wechat/config', params)
}

// 获取公众号统计数据
export const getWechatStats = () => {
  return getApiRequest('/admin/wechat/stats')
}

// ========== 微信粉丝 ==========
// 获取粉丝列表
export const getWechatFansList = (params?: any) => {
  return getApiRequest('/admin/wechat/fans', params)
}

// ========== 微信订阅 ==========
// 获取订阅列表
export const getWechatSubscribeList = (params?: any) => {
  return getApiRequest('/admin/wechat/subscribe', params)
}

// ========== 微信模板 ==========
// 获取模板列表
export const getWechatTemplateList = (params?: any) => {
  return getApiRequest('/admin/wechat/template', params)
}

// ========== 微信菜单 ==========
// 获取微信菜单
export const getWechatMenu = () => {
  return getApiRequest('/admin/wechat/menu')
}

// 更新微信菜单
export const updateWechatMenu = (params: any) => {
  return postApiRequest('/admin/wechat/menu', params)
}

// ========== 微信H5 ==========
// 获取H5页面列表
export const getWechatH5List = (params?: any) => {
  return getApiRequest('/admin/wechat/h5-pages', params)
}

// ========== 微信素材 ==========
// 获取素材列表（图片/视频/语音/图文）
export const getWechatMaterialList = (type: string, params?: any) => {
  return getApiRequest(`/admin/wechat/materials/${type}`, params)
}

// 上传素材
export const uploadWechatMaterial = (type: string, params: any) => {
  return postApiRequest(`/admin/wechat/materials/${type}`, params)
}

// 删除素材
export const deleteWechatMaterial = (type: string, id: string) => {
  return deleteApiRequest(`/admin/wechat/materials/${type}/${id}`)
}

// ========== 微信优惠券 ==========
// 获取优惠券列表
export const getWechatCouponList = (params?: any) => {
  return getApiRequest('/admin/wechat/coupon-list', params)
}

// 获取优惠券领取记录
export const getWechatCouponRecord = (params?: any) => {
  return getApiRequest('/admin/wechat/coupon-record', params)
}

// ========== 微信OAuth ==========
// 获取OAuth用户列表
export const getWechatOAuthUserList = (params?: any) => {
  return getApiRequest('/admin/wechat/oauth-user', params)
}

// 获取OAuth应用列表
export const getWechatOAuthAppList = (params?: any) => {
  return getApiRequest('/admin/wechat/oauth-app', params)
}

// 获取OAuth令牌列表
export const getWechatOAuthTokenList = (params?: any) => {
  return getApiRequest('/admin/wechat/oauth-token', params)
}

