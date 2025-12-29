import { getRequest, postRequest, patchRequest, deleteRequest } from '@/libs/axios'

// ========== 订单管理 ==========
// 获取订单列表
export const getOrderList = (params?: any) => {
  return getRequest('/order', params)
}

// 获取订单详情
export const getOrderDetail = (id: string) => {
  return getRequest(`/order/${id}`)
}

// 更新订单状态
export const updateOrderStatus = (id: string, params: any) => {
  return patchRequest(`/order/${id}/status`, params)
}

// 取消订单
export const cancelOrder = (id: string, params: any) => {
  return patchRequest(`/order/${id}/cancel`, params)
}

// 订单退款
export const refundOrder = (id: string, params: any) => {
  return postRequest(`/order/${id}/refund`, params)
}

// 订单发货
export const shipOrder = (id: string, params: any) => {
  return patchRequest(`/order/${id}/ship`, params)
}

// 删除订单（如果后端支持）
export const deleteOrder = (id: string) => {
  return deleteRequest(`/order/${id}`)
}

// 批量删除订单
export const batchDeleteOrder = (ids: string[]) => {
  return deleteRequest('/order/batch', { ids })
}

// 导出订单
export const exportOrder = (params?: any) => {
  return getRequest('/order/export', params, { responseType: 'blob' })
}

// ========== 虚拟订单 ==========
// 获取虚拟订单列表
export const getVirtualOrderList = (params?: any) => {
  return getRequest('/order/virtual', params)
}

