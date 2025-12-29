// 统一错误处理工具
import { ElMessage, ElMessageBox } from 'element-plus'
import type { ApiResponse } from '@/types/api'

/**
 * 处理 API 响应错误
 */
export const handleApiError = (error: any, defaultMessage = '操作失败') => {
  console.error('API Error:', error)
  
  if (error?.response?.data) {
    const data = error.response.data
    if (data.message) {
      ElMessage.error(data.message)
      return
    }
  }
  
  if (error?.message) {
    ElMessage.error(error.message)
    return
  }
  
  ElMessage.error(defaultMessage)
}

/**
 * 处理 API 响应
 */
export const handleApiResponse = <T = any>(
  res: ApiResponse<T>,
  successMessage?: string,
  showError = true
): T | null => {
  if (res.success) {
    if (successMessage) {
      ElMessage.success(successMessage)
    }
    return res.result
  } else {
    if (showError) {
      ElMessage.error(res.message || '操作失败')
    }
    return null
  }
}

/**
 * 确认对话框
 */
export const confirmAction = async (
  message: string,
  title = '提示',
  type: 'warning' | 'info' | 'success' | 'error' = 'warning'
): Promise<boolean> => {
  try {
    await ElMessageBox.confirm(message, title, {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type
    })
    return true
  } catch {
    return false
  }
}

/**
 * 处理删除确认
 */
export const confirmDelete = async (itemName = '该记录'): Promise<boolean> => {
  return await confirmAction(`确定要删除${itemName}吗？`, '提示', 'warning')
}

/**
 * 处理批量删除确认
 */
export const confirmBatchDelete = async (count: number, itemName = '记录'): Promise<boolean> => {
  return await confirmAction(
    `确定要删除选中的 ${count} 个${itemName}吗？`,
    '提示',
    'warning'
  )
}

