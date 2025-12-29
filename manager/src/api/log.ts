// 日志相关 API
// 注意：system/log 控制器不在 manager 模块下，路径是 /api/system/log
import { getApiRequest, postApiRequest, deleteApiRequest } from '@/libs/axios'

// ========== 系统日志 ==========
// 创建系统日志
export const createSystemLog = (params: any) => {
  return postApiRequest('/system/log', params)
}

// 获取系统日志列表
export const getSystemLogList = (params?: any) => {
  return getApiRequest('/system/log', params)
}

// 获取系统日志详情
export const getSystemLogDetail = (id: string) => {
  return getApiRequest(`/system/log/${id}`)
}

// 获取日志统计信息
export const getLogStatistics = (days?: number) => {
  return getApiRequest('/system/log/statistics', { days })
}

// 获取日志类型列表
export const getLogTypes = () => {
  return getApiRequest('/system/log/types')
}

// 获取模块列表
export const getLogModules = () => {
  return getApiRequest('/system/log/modules')
}

// 删除日志
export const deleteSystemLog = (id: string) => {
  return deleteApiRequest(`/system/log/${id}`)
}

// 批量删除日志
export const batchDeleteSystemLog = (ids: number[]) => {
  return postApiRequest('/system/log/batch-delete', { ids })
}

// 清理过期日志
export const cleanExpiredLogs = (keepDays?: number) => {
  return postApiRequest('/system/log/clean-expired', { keepDays })
}

