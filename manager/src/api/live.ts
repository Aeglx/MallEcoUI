// 直播相关 API
// 注意：live 控制器不在 manager 模块下，路径是 /api/live
import { getApiRequest, postApiRequest, putApiRequest, deleteApiRequest } from '@/libs/axios'

// ========== 直播间管理 ==========
// 获取直播间列表
export const getLiveRoomList = (params?: any) => {
  return getApiRequest('/live/room', params)
}

// 获取直播间详情
export const getLiveRoomDetail = (id: string) => {
  return getApiRequest(`/live/room/${id}`)
}

// 新增直播间
export const addLiveRoom = (params: any) => {
  return postApiRequest('/live/room', params)
}

// 更新直播间
export const updateLiveRoom = (id: string, params: any) => {
  return putApiRequest(`/live/room/${id}`, params)
}

// 删除直播间
export const deleteLiveRoom = (id: string) => {
  return deleteApiRequest(`/live/room/${id}`)
}

// ========== 直播商品 ==========
// 获取直播商品列表
export const getLiveGoodsList = (roomId: string, params?: any) => {
  return getApiRequest(`/live/room/${roomId}/goods`, params)
}

// ========== 直播统计 ==========
// 获取直播统计
export const getLiveStatistics = (params?: any) => {
  return getApiRequest('/live/statistics', params)
}

