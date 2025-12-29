import { getRequest, postRequest, putRequest, patchRequest, deleteRequest } from '@/libs/axios'

// ========== 商品管理 ==========
// 获取商品列表
export const getGoodsList = (params?: any) => {
  return getRequest('/goods', params)
}

// 获取商品详情
export const getGoodsDetail = (id: string) => {
  return getRequest(`/goods/${id}`)
}

// 新增商品
export const addGoods = (params: any) => {
  return postRequest('/goods', params)
}

// 更新商品
export const updateGoods = (id: string, params: any) => {
  return patchRequest(`/goods/${id}`, params)
}

// 删除商品
export const deleteGoods = (id: string) => {
  return deleteRequest(`/goods/${id}`)
}

// 批量删除商品
export const batchDeleteGoods = (ids: string[]) => {
  return deleteRequest('/goods/batch', { ids })
}

// 上架/下架商品
export const updateGoodsStatus = (id: string, params: any) => {
  return patchRequest(`/goods/${id}/status`, params)
}

// 获取商品分类树（用于选择器等场景）
export const getCategoryTree = (parentId?: number) => {
  if (parentId !== undefined) {
    return getRequest(`/goods/category/${parentId}/children`)
  }
  return getRequest('/goods/category')
}

// ========== 品牌管理 ==========
// 获取品牌列表
export const getBrandList = (params?: any) => {
  return getRequest('/goods/brand', params)
}

// 获取品牌详情
export const getBrandDetail = (id: string) => {
  return getRequest(`/goods/brand/${id}`)
}

// 新增品牌
export const addBrand = (params: any) => {
  return postRequest('/goods/brand', params)
}

// 更新品牌
export const updateBrand = (id: string, params: any) => {
  return patchRequest(`/goods/brand/${id}`, params)
}

// 删除品牌
export const deleteBrand = (ids: string) => {
  return deleteRequest(`/goods/brand/${ids}`)
}

// 批量操作品牌
export const batchBrand = (params: any) => {
  return postRequest('/goods/brand/batch', params)
}

// ========== 分类管理 ==========
// 获取分类列表（树形结构）
export const getCategoryList = () => {
  return getRequest('/goods/category')
}

// 获取分类详情
export const getCategoryDetail = (id: string) => {
  return getRequest(`/goods/category/${id}`)
}

// 新增分类
export const addCategory = (params: any) => {
  return postRequest('/goods/category', params)
}

// 更新分类
export const updateCategory = (id: string, params: any) => {
  return patchRequest(`/goods/category/${id}`, params)
}

// 删除分类
export const deleteCategory = (id: string) => {
  return deleteRequest(`/goods/category/${id}`)
}

// ========== 规格管理 ==========
// 注意：规格管理API需要后端在 manager 模块中实现
// 目前后端只有 seller 端有规格管理，如果后端未实现，请联系后端开发添加
// 临时使用通用路径，实际路径需要与后端确认
export const getSpecList = (params?: any) => {
  return getRequest('/goods/spec', params)
}

export const getSpecDetail = (id: string) => {
  return getRequest(`/goods/spec/${id}`)
}

export const addSpec = (params: any) => {
  return postRequest('/goods/spec', params)
}

export const updateSpec = (id: string, params: any) => {
  return patchRequest(`/goods/spec/${id}`, params)
}

export const deleteSpec = (id: string) => {
  return deleteRequest(`/goods/spec/${id}`)
}

// ========== 参数管理 ==========
// 注意：参数管理API需要后端在 manager 模块中实现
// 临时使用通用路径，实际路径需要与后端确认
export const getParameterList = (params?: any) => {
  return getRequest('/goods/parameter', params)
}

export const getParameterDetail = (id: string) => {
  return getRequest(`/goods/parameter/${id}`)
}

export const addParameter = (params: any) => {
  return postRequest('/goods/parameter', params)
}

export const updateParameter = (id: string, params: any) => {
  return patchRequest(`/goods/parameter/${id}`, params)
}

export const deleteParameter = (id: string) => {
  return deleteRequest(`/goods/parameter/${id}`)
}

