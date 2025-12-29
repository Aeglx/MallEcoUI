import { getRequest, postRequest, putRequest, patchRequest, deleteRequest } from '@/libs/axios'

// ========== 促销活动 ==========
// 获取促销活动列表
export const getPromotionList = (params?: any) => {
  return getRequest('/promotion', params)
}

// 获取促销活动详情
export const getPromotionDetail = (id: string) => {
  return getRequest(`/promotion/${id}`)
}

// 新增促销活动
export const addPromotion = (params: any) => {
  return postRequest('/promotion', params)
}

// 更新促销活动
export const updatePromotion = (id: string, params: any) => {
  return patchRequest(`/promotion/${id}`, params)
}

// 删除促销活动
export const deletePromotion = (ids: string) => {
  return deleteRequest(`/promotion/${ids}`)
}

// 更新促销活动状态
export const updatePromotionStatus = (id: string, params: any) => {
  return patchRequest(`/promotion/${id}/status`, params)
}

// ========== 优惠券 ==========
// 获取优惠券列表
export const getCouponList = (params?: any) => {
  return getRequest('/promotion/coupon', params)
}

// 获取优惠券详情
export const getCouponDetail = (id: string) => {
  return getRequest(`/promotion/coupon/${id}`)
}

// 新增优惠券
export const addCoupon = (params: any) => {
  return postRequest('/promotion/coupon', params)
}

// 更新优惠券
export const updateCoupon = (id: string, params: any) => {
  return putRequest(`/promotion/coupon/${id}`, params)
}

// 删除优惠券
export const deleteCoupon = (id: string) => {
  return deleteRequest(`/promotion/coupon/${id}`)
}

// 获取优惠券领取记录
export const getCouponReceiveList = (couponId: string, params?: any) => {
  return getRequest(`/promotion/coupon/${couponId}/receive`, params)
}

// ========== 满减活动 ==========
// 获取满减活动列表
export const getFullDiscountList = (params?: any) => {
  return getRequest('/promotion/full', params)
}

// 获取满减活动详情
export const getFullDiscountDetail = (id: string) => {
  return getRequest(`/promotion/full/${id}`)
}

// 新增满减活动
export const addFullDiscount = (params: any) => {
  return postRequest('/promotion/full', params)
}

// 更新满减活动
export const updateFullDiscount = (id: string, params: any) => {
  return putRequest(`/promotion/full/${id}`, params)
}

// 删除满减活动
export const deleteFullDiscount = (id: string) => {
  return deleteRequest(`/promotion/full/${id}`)
}

// ========== 秒杀活动 ==========
// 获取秒杀活动列表
export const getSeckillList = (params?: any) => {
  return getRequest('/promotion/seckill', params)
}

// 获取秒杀活动详情
export const getSeckillDetail = (id: string) => {
  return getRequest(`/promotion/seckill/${id}`)
}

// 新增秒杀活动
export const addSeckill = (params: any) => {
  return postRequest('/promotion/seckill', params)
}

// 更新秒杀活动
export const updateSeckill = (id: string, params: any) => {
  return putRequest(`/promotion/seckill/${id}`, params)
}

// 删除秒杀活动
export const deleteSeckill = (id: string) => {
  return deleteRequest(`/promotion/seckill/${id}`)
}

// 获取秒杀商品列表
export const getSeckillGoodsList = (seckillId: string, params?: any) => {
  return getRequest(`/promotion/seckill/${seckillId}/goods`, params)
}

// ========== 拼团活动 ==========
// 获取拼团活动列表
export const getGroupList = (params?: any) => {
  return getRequest('/promotion/group', params)
}

// 获取拼团活动详情
export const getGroupDetail = (id: string) => {
  return getRequest(`/promotion/group/${id}`)
}

// 新增拼团活动
export const addGroup = (params: any) => {
  return postRequest('/promotion/group', params)
}

// 更新拼团活动
export const updateGroup = (id: string, params: any) => {
  return putRequest(`/promotion/group/${id}`, params)
}

// 删除拼团活动
export const deleteGroup = (id: string) => {
  return deleteRequest(`/promotion/group/${id}`)
}

// 获取拼团商品列表
export const getGroupGoodsList = (groupId: string, params?: any) => {
  return getRequest(`/promotion/group/${groupId}/goods`, params)
}

