import { getRequest, postRequest, putRequest, deleteRequest } from '@/libs/axios'

/**
 * 获取订单列表
 */
export function getOrderList(params: any) {
  return getRequest('/buyer/order/order', params)
}

/**
 * 获取订单详情
 */
export function getOrderDetail(orderSn: string) {
  return getRequest(`/buyer/order/order/${orderSn}`)
}

/**
 * 取消订单
 */
export function cancelOrder(orderSn: string, reason?: string) {
  return postRequest(`/buyer/order/order/${orderSn}/cancel`, { reason })
}

/**
 * 确认收货
 */
export function confirmReceipt(orderSn: string) {
  return postRequest(`/buyer/order/order/${orderSn}/receipt`)
}

/**
 * 删除订单
 */
export function deleteOrder(orderSn: string) {
  return deleteRequest(`/buyer/order/order/${orderSn}`)
}

/**
 * 获取售后列表
 */
export function getAfterSaleList(params: any) {
  return getRequest('/buyer/order/afterSale', params)
}

/**
 * 获取售后详情
 */
export function getAfterSaleDetail(afterSaleSn: string) {
  return getRequest(`/buyer/order/afterSale/${afterSaleSn}`)
}

/**
 * 申请售后
 */
export function applyAfterSale(params: any) {
  return postRequest('/buyer/order/afterSale', params)
}

/**
 * 取消售后
 */
export function cancelAfterSale(afterSaleSn: string) {
  return postRequest(`/buyer/order/afterSale/${afterSaleSn}/cancel`)
}

