// 售后相关 API
// 注意：after-sales 控制器不在 manager 模块下，路径是 /api/after-sales
import { getApiRequest, postApiRequest, putApiRequest, patchApiRequest, deleteApiRequest } from '@/libs/axios'

// ========== 售后订单 ==========
// 获取售后订单列表
export const getAfterSaleList = (params?: any) => {
  return getApiRequest('/after-sales', params)
}

// 获取售后订单详情
export const getAfterSaleDetail = (id: string) => {
  return getApiRequest(`/after-sales/${id}`)
}

// 审核售后申请
export const reviewAfterSale = (id: string, params: any) => {
  return putApiRequest(`/after-sales/review/${id}`, params)
}

// 提交退货物流信息
export const submitReturnInfo = (id: string, params: any) => {
  return putApiRequest(`/after-sales/return-info/${id}`, params)
}

// 处理售后（确认收货）
export const completeAfterSale = (id: string, params: any) => {
  return putApiRequest(`/after-sales/complete/${id}`, params)
}

// 取消售后
export const cancelAfterSale = (id: string, userId: string) => {
  return putApiRequest(`/after-sales/cancel/${id}?userId=${userId}`)
}

// ========== 投诉管理 ==========
// 获取投诉列表（在 manager/order 下，使用 manager baseURL）
import { getRequest, postRequest } from '@/libs/axios'

export const getComplaintList = (params?: any) => {
  return getRequest('/order/complaint', params)
}

// 获取投诉详情
export const getComplaintDetail = (id: string) => {
  return getRequest(`/order/complaint/${id}`)
}

// 处理投诉
export const handleComplaint = (id: string, params: any) => {
  return postRequest(`/order/complaint/${id}/handle`, params)
}

// ========== 退货原因 ==========
// 获取退货原因列表
export const getReasonList = (params?: any) => {
  return getRequest('/order/reason', params)
}

// 获取退货原因详情
export const getReasonDetail = (id: string) => {
  return getRequest(`/order/reason/${id}`)
}

// 新增退货原因
export const addReason = (params: any) => {
  return postRequest('/order/reason', params)
}

// 更新退货原因
export const updateReason = (id: string, params: any) => {
  return postRequest(`/order/reason/${id}`, params)
}

// 删除退货原因
export const deleteReason = (id: string) => {
  return getRequest(`/order/reason/${id}/delete`)
}

// ========== 订单流水 ==========
// 获取订单流水列表
export const getOrderFlowList = (params?: any) => {
  return getRequest('/order/flow', params)
}

// 获取订单流水详情
export const getOrderFlowDetail = (id: string) => {
  return getRequest(`/order/flow/${id}`)
}

// ========== 支付记录 ==========
// 获取支付记录列表
export const getPaymentRecordList = (params?: any) => {
  return getRequest('/order/payment', params)
}

// 获取支付记录详情
export const getPaymentRecordDetail = (id: string) => {
  return getRequest(`/order/payment/${id}`)
}

// ========== 退款记录 ==========
// 获取退款记录列表
export const getRefundFlowList = (params?: any) => {
  return getRequest('/order/refund', params)
}

// 获取退款记录详情
export const getRefundFlowDetail = (id: string) => {
  return getRequest(`/order/refund/${id}`)
}

