// 运营相关 API
// 注意：operate 相关控制器不在 manager 模块下
// 文章在 buyer/other/article，反馈在 /api/feedback，热搜词可能需要后端确认
import { getRequest, postRequest, putRequest, deleteRequest, getApiRequest, postApiRequest, putApiRequest, deleteApiRequest } from '@/libs/axios'

// ========== 文章管理 ==========
// 获取文章列表
export const getArticleList = (params?: any) => {
  return getApiRequest('/buyer/other/article', params)
}

// 获取文章详情
export const getArticleDetail = (id: string) => {
  return getApiRequest(`/buyer/other/article/get/${id}`)
}

// ========== 文章分类 ==========
// 获取文章分类列表
export const getArticleCategoryList = () => {
  return getApiRequest('/buyer/other/article/articleCategory/list')
}

// ========== 反馈管理 ==========
// 获取反馈列表
export const getFeedbackList = (params?: any) => {
  return getApiRequest('/api/feedback', params)
}

// 获取反馈详情
export const getFeedbackDetail = (id: string) => {
  return getApiRequest(`/api/feedback/${id}`)
}

// 处理反馈
export const handleFeedback = (id: string, params: any) => {
  return postApiRequest(`/api/feedback/${id}/handle`, params)
}

// 删除反馈
export const deleteFeedback = (id: string) => {
  return deleteApiRequest(`/api/feedback/${id}`)
}

// ========== 热搜词 ==========
// 注意：热搜词 API 路径需要后端确认，这里暂时使用通用路径
// 获取热搜词列表
export const getHotWordsList = (params?: any) => {
  return getRequest('/operate/hotwords', params)
}

// 获取热搜词详情
export const getHotWordsDetail = (id: string) => {
  return getRequest(`/operate/hotwords/${id}`)
}

// 新增热搜词
export const addHotWords = (params: any) => {
  return postRequest('/operate/hotwords', params)
}

// 更新热搜词
export const updateHotWords = (id: string, params: any) => {
  return putRequest(`/operate/hotwords/${id}`, params)
}

// 删除热搜词
export const deleteHotWords = (id: string) => {
  return deleteRequest(`/operate/hotwords/${id}`)
}

