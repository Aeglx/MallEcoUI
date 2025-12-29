// API 响应类型定义
export interface ApiResponse<T = any> {
  success: boolean
  result: T
  message?: string
  code?: number
}

