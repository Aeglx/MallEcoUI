import { getRequest } from '@/libs/axios'

/**
 * 商品列表
 */
export function goodsList(params: any) {
  return getRequest('/buyer/goods/goods/es', params, {
    needToken: false
  })
}

/**
 * 商品分类筛选条件（品牌、尺寸等）
 */
export function filterList(params: any) {
  return getRequest('/buyer/goods/goods/es/related', params, {
    needToken: false
  })
}

/**
 * 根据ID获取商品详情
 */
export function goodsDetail(goodsId: string) {
  return getRequest(`/buyer/goods/goods/get/${goodsId}`, {}, {
    needToken: false
  })
}

/**
 * 根据ID获取商品SKU详情
 */
export function goodsSkuDetail(params: { goodsId: string; skuId: string }) {
  return getRequest(`/buyer/goods/goods/sku/${params.goodsId}/${params.skuId}`, params)
}

/**
 * 获取所有商品分类
 */
export function getCategory(parentId?: string) {
  const url = parentId
    ? `/buyer/goods/category/get/${parentId}`
    : '/buyer/goods/category/get/0'
  return getRequest(url, {}, {
    needToken: false
  })
}

/**
 * 获取商品评价列表
 */
export function getGoodsEvaluation(params: any) {
  return getRequest('/buyer/member/evaluation', params, {
    needToken: false
  })
}

/**
 * 获取商品咨询列表
 */
export function getGoodsConsultation(params: any) {
  return getRequest('/buyer/goods/goods/consultation', params, {
    needToken: false
  })
}

