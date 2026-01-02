import { getRequest, postRequest, putRequest, deleteRequest } from '@/libs/axios'

/**
 * 清空购物车
 */
export function clearCart() {
  return deleteRequest('/buyer/trade/carts')
}

/**
 * 获取购物车页面购物车详情
 */
export function cartGoodsAll() {
  return getRequest('/buyer/trade/carts/all')
}

/**
 * 获取购物车商品数量
 */
export function cartCount() {
  return getRequest('/buyer/trade/carts/count')
}

/**
 * 获取结算页面购物车详情
 */
export function cartGoodsPay(params: any) {
  return getRequest('/buyer/trade/carts/checked', params)
}

/**
 * 向购物车添加一个商品
 */
export function addCartGoods(params: { skuId: string; num: number }) {
  return postRequest('/buyer/trade/carts', params)
}

/**
 * 创建交易
 */
export function createTrade(data: any) {
  return postRequest('/buyer/trade/carts/create/trade', data, {
    headers: { 'Content-Type': 'application/json' }
  })
}

/**
 * 选择优惠券
 */
export function selectCoupon(params: any) {
  return getRequest('/buyer/trade/carts/select/coupon', params)
}

/**
 * 可用优惠券数量
 */
export function couponNum(params: any) {
  return getRequest('/buyer/trade/carts/coupon/num', params)
}

/**
 * 选择收货地址
 */
export function selectAddr(params: any) {
  return getRequest('/buyer/trade/carts/shippingAddress', params)
}

/**
 * 选中购物车所有商品
 */
export function setCheckedAll(params: { checked: number }) {
  return postRequest('/buyer/trade/carts/sku/checked', params)
}

/**
 * 批量设置某商家的商品为选中或不选中
 */
export function setCheckedSeller(params: { checked: number; storeId: string }) {
  return postRequest(`/buyer/trade/carts/store/${params.storeId}`, params)
}

/**
 * 选中购物车中单个产品
 */
export function setCheckedGoods(params: { skuId: string; checked: number }) {
  return postRequest(`/buyer/trade/carts/sku/checked/${params.skuId}`, params)
}

/**
 * 更新购物车中单个产品数量
 */
export function setCartGoodsNum(params: { skuId: string; num: number }) {
  return postRequest(`/buyer/trade/carts/sku/num/${params.skuId}`, params)
}

/**
 * 删除购物车中一个或多个产品
 */
export function delCartGoods(params: { skuIds: string[] }) {
  return deleteRequest('/buyer/trade/carts/sku/remove', params)
}

/**
 * 选择配送方式
 */
export function shippingMethod(params: any) {
  return getRequest('/buyer/trade/carts/shippingMethod', params)
}

/**
 * 选择发票
 */
export function receiptSelect(params: any) {
  return getRequest('/buyer/trade/carts/select/receipt', params)
}

/**
 * 获取全部配送方式
 */
export function shippingMethodList(params: any) {
  return getRequest('/buyer/trade/carts/shippingMethodList', params)
}

/**
 * 获取店铺地址列表
 */
export function storeAddressList(params: any) {
  return getRequest('/buyer/store/address/shippingMethodList', params)
}

/**
 * 设置自提地址ID
 */
export function setStoreAddressId(storeAddressId: string, way: string) {
  return getRequest(`/buyer/trade/carts/storeAddress?storeAddressId=${storeAddressId}&way=${way}`)
}

/**
 * 提交配送方式
 */
export function setShipMethod(params: any) {
  return putRequest('/buyer/trade/carts/shippingMethod', params)
}

