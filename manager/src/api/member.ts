// 会员相关 API
import { getRequest, putRequest, postRequest, deleteRequest, patchRequest } from '@/libs/axios'

// ========== 会员管理 ==========
// 获取会员列表（分页）
export const getMember = (params?: any) => {
  return getRequest('/member', params)
}

// 获取会员详情
export const getMemberDetail = (id: string) => {
  return getRequest(`/member/${id}`)
}

// 更新会员状态
export const updateMemberStatus = (id: string, params: any) => {
  return patchRequest(`/member/${id}/status`, params)
}

// 新增会员（如果后端支持）
export const addMember = (params: any) => {
  return postRequest('/member', params)
}

// 更新会员信息（如果后端支持）
export const updateMember = (id: string, params: any) => {
  return patchRequest(`/member/${id}`, params)
}

// 删除会员（如果后端支持）
export const deleteMember = (id: string) => {
  return deleteRequest(`/member/${id}`)
}

// 批量删除会员
export const batchDeleteMember = (ids: string[]) => {
  return deleteRequest('/member/batch', { ids })
}

// ========== 会员评价 ==========
// 分页获取会员评价
export const getMemberReview = (params?: any) => {
  return getRequest('/member/evaluation', params)
}

// 获取评价详情
export const getEvaluationDetail = (id: string) => {
  return getRequest(`/member/evaluation/${id}`)
}

// 更新评价状态
export const updateEvaluationStatus = (id: string, params: any) => {
  return patchRequest(`/member/evaluation/${id}/status`, params)
}

// 删除评价
export const deleteEvaluation = (id: string) => {
  return deleteRequest(`/member/evaluation/${id}`)
}

// ========== 会员回收站 ==========
// 获取回收站会员列表
export const getRecycleMember = (params?: any) => {
  return getRequest('/member/recycle', params)
}

// 恢复会员
export const restoreMember = (id: string) => {
  return postRequest(`/member/recycle/${id}/restore`)
}

// 永久删除会员
export const permanentDeleteMember = (id: string) => {
  return deleteRequest(`/member/recycle/${id}`)
}

// ========== 积分管理 ==========
// 获取积分记录列表
export const getPointLog = (params?: any) => {
  return getRequest('/member/point/log', params)
}

// 调整会员积分
export const adjustMemberPoint = (memberId: string, params: any) => {
  return postRequest(`/member/${memberId}/point/adjust`, params)
}

// 获取会员积分信息
export const getMemberPoint = (memberId: string) => {
  return getRequest(`/member/${memberId}/point`)
}

