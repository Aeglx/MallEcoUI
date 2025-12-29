// 钱包相关 API
// 注意：wallet 控制器不在 manager 模块下，路径是 /api/wallet
import { getApiRequest, postApiRequest, patchApiRequest } from '@/libs/axios'

// ========== 钱包交易记录 ==========
// 获取用户钱包交易记录
export const getWalletTransactions = (userId: string, params?: any) => {
  return getApiRequest(`/wallet/${userId}/transactions`, params)
}

// ========== 充值管理 ==========
// 手动充值（管理员操作）
export const manualRecharge = (userId: string, params: any) => {
  return postApiRequest(`/wallet/${userId}/recharge`, params)
}

// ========== 提现管理 ==========
// 提现申请
export const withdrawApply = (userId: string, params: any) => {
  return postApiRequest(`/wallet/${userId}/withdraw`, params)
}

