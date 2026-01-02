import { getRequest, postRequest, putRequest, deleteRequest } from '@/libs/axios'

/**
 * 获取会员信息
 */
export function getMemberInfo() {
  return getRequest('/buyer/passport/member')
}

/**
 * 更新会员信息
 */
export function updateMemberInfo(params: any) {
  return putRequest('/buyer/passport/member', params)
}

/**
 * 修改密码
 */
export function changePassword(params: any) {
  return postRequest('/buyer/passport/member/modifyPass', params)
}

/**
 * 获取会员收藏列表
 */
export function getFavorites(params: any) {
  return getRequest('/buyer/member/member/favorite', params)
}

/**
 * 添加收藏
 */
export function addFavorite(params: { goodsId: string }) {
  return postRequest('/buyer/member/member/favorite', params)
}

/**
 * 取消收藏
 */
export function removeFavorite(goodsId: string) {
  return deleteRequest(`/buyer/member/member/favorite/${goodsId}`)
}

/**
 * 获取会员足迹
 */
export function getTracks(params: any) {
  return getRequest('/buyer/member/footprint', params)
}

/**
 * 删除足迹
 */
export function deleteTrack(id: string) {
  return deleteRequest(`/buyer/member/footprint/${id}`)
}

/**
 * 获取会员优惠券列表
 */
export function getCoupons(params: any) {
  return getRequest('/buyer/member/coupon', params)
}

/**
 * 获取收货地址列表
 */
export function getAddressList() {
  return getRequest('/buyer/member/address')
}

/**
 * 添加收货地址
 */
export function addAddress(params: any) {
  return postRequest('/buyer/member/address', params)
}

/**
 * 更新收货地址
 */
export function updateAddress(id: string, params: any) {
  return putRequest(`/buyer/member/address/${id}`, params)
}

/**
 * 删除收货地址
 */
export function deleteAddress(id: string) {
  return deleteRequest(`/buyer/member/address/${id}`)
}

/**
 * 设置默认地址
 */
export function setDefaultAddress(id: string) {
  return putRequest(`/buyer/member/address/${id}/default`)
}

