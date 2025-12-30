import { getRequest } from '@/libs/axios'

/**
 * 获取首页专题数据
 */
export function getTopicData(id: string) {
  return getRequest(`/buyer/other/pageData/get/${id}`)
}

/**
 * 获取首页楼层装修数据
 */
export function indexData(params?: { clientType?: string }) {
  return getRequest('/buyer/other/pageData/getIndex', params)
}

/**
 * 获取自动发券
 */
export function getAutoCoup() {
  return getRequest('/buyer/promotion/coupon/activity', {}, { needToken: true })
}

/**
 * 获取店铺楼层数据
 */
export function getFloorStoreData(params?: any) {
  return getRequest('/buyer/other/pageData', { pageClientType: 'PC', ...params })
}

/**
 * 楼层装修数据
 * @param pageClientType 客户端类型,可用值:PC,H5,WECHAT_MP,APP
 * @param pageType 页面类型,可用值:INDEX,STORE,SPECIAL
 */
export function pageData(params?: any) {
  return getRequest('/buyer/other/pageData', params)
}

/**
 * 刷新token
 */
export function handleRefreshToken(token: string) {
  return getRequest(`/buyer/passport/member/refresh/${token}`)
}

