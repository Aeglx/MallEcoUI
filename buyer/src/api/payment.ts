import { getRequest, postRequest } from '@/libs/axios'

/**
 * 创建支付订单
 */
export function createPayment(params: {
  orderId: string
  paymentMethod: string
  paymentClient: 'pc' | 'h5' | 'app'
  amount: number
  subject?: string
  body?: string
  returnUrl?: string
}) {
  return postRequest('/buyer/payment/create', params)
}

/**
 * 支付接口
 */
export function pay(paymentMethod: string, paymentClient: string, params: any) {
  return getRequest(`/buyer/payment/pay/${paymentMethod}/${paymentClient}`, params)
}

/**
 * 查询支付状态
 */
export function queryPayment(outTradeNo: string) {
  return getRequest(`/buyer/payment/query/${outTradeNo}`)
}

/**
 * 关闭支付订单
 */
export function closePayment(outTradeNo: string) {
  return postRequest(`/buyer/payment/close/${outTradeNo}`)
}

/**
 * 获取支付方式列表
 */
export function getPaymentMethods() {
  return getRequest('/buyer/payment/methods')
}

