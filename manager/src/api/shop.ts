// 店铺相关 API
// 注意：baseURL 已经包含 /api/manager，所以路径不需要再加 /manager 前缀
import { getRequest, postRequest, patchRequest, deleteRequest } from '@/libs/axios'

// ========== 店铺管理 ==========
// 获取店铺列表
export const getShopList = (params?: any) => {
  return getRequest('/shop', params)
}

// 获取店铺详情
export const getShopDetail = (id: string) => {
  return getRequest(`/shop/${id}`)
}

// 新增店铺
export const addShop = (params: any) => {
  return postRequest('/shop', params)
}

// 更新店铺
export const updateShop = (id: string, params: any) => {
  return patchRequest(`/shop/${id}`, params)
}

// 删除店铺
export const deleteShop = (id: string) => {
  return deleteRequest(`/shop/${id}`)
}

// 启用/禁用店铺
export const updateShopStatus = (id: string, params: any) => {
  return patchRequest(`/shop/${id}/status`, params)
}

// ========== 店铺审核 ==========
// 获取待审核店铺列表
export const getShopAuditList = (params?: any) => {
  return getRequest('/shop/audit', params)
}

// 审核通过
export const approveShop = (id: string, params?: any) => {
  return postRequest(`/shop/${id}/approve`, params)
}

// 审核拒绝
export const rejectShop = (id: string, params: any) => {
  return postRequest(`/shop/${id}/reject`, params)
}

// ========== 店铺结算 ==========
// 获取结算列表
export const getShopSettlementList = (params?: any) => {
  return getRequest('/shop/settlement', params)
}

// 获取结算详情
export const getShopSettlementDetail = (id: string) => {
  return getRequest(`/shop/settlement/${id}`)
}

// 确认结算
export const confirmSettlement = (id: string, params?: any) => {
  return postRequest(`/shop/settlement/${id}/confirm`, params)
}

// ========== 对账管理 ==========
// 获取对账列表
export const getReconciliationList = (params?: any) => {
  return getRequest('/shop/reconciliation', params)
}

// 生成对账单
export const generateReconciliation = (params: any) => {
  return postRequest('/shop/reconciliation/generate', params)
}

