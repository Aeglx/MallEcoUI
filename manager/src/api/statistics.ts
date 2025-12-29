// 统计相关 API
// 注意：baseURL 已经包含 /api/manager，所以路径不需要再加 /manager 前缀
import { getRequest } from '@/libs/axios'

// ========== 统计概览 ==========
// 获取统计概览
export const getStatisticsOverview = (params?: any) => {
  return getRequest('/statistics/index', params)
}

// 获取商品统计
export const getGoodsStatistics = (params?: any) => {
  return getRequest('/statistics/index/goodsStatistics', params)
}

// 获取店铺统计
export const getShopStatistics = (params?: any) => {
  return getRequest('/statistics/index/storeStatistics', params)
}

// ========== 会员统计 ==========
// 获取会员统计列表
export const getMemberStatistics = (params?: any) => {
  return getRequest('/statistics/member', params)
}

// 兼容旧版本的导出名称
export const getStatisticsList = getMemberStatistics

// 获取历史会员流量图表
export const getMemberHistoryChart = () => {
  return getRequest('/statistics/member/history')
}

// 兼容旧版本的导出名称
export const historyMemberChartList = getMemberHistoryChart

// ========== 订单统计 ==========
// 获取订单统计图表
export const getOrderStatistics = (params?: any) => {
  return getRequest('/statistics/order', params)
}

// 兼容旧版本的导出名称
export const getOrderChart = getOrderStatistics

// 获取订单详情统计
export const getOrderDetailStatistics = (params?: any) => {
  return getRequest('/statistics/order/detail', params)
}

// 获取退款订单统计
export const getRefundOrderStatistics = (params?: any) => {
  return getRequest('/statistics/order/refund', params)
}

// ========== 商品统计 ==========
// 获取商品统计
export const getGoodsStatisticsList = (params?: any) => {
  return getRequest('/statistics/goods', params)
}

// ========== 流量统计 ==========
// 获取流量统计
export const getTrafficStatistics = (params?: any) => {
  return getRequest('/statistics/traffic', params)
}

