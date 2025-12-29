// 会员相关类型定义

export type MemberStatus = 'ENABLE' | 'DISABLE'

export interface MemberItem {
  id: string
  username: string
  nickName?: string
  mobile: string
  email?: string
  status: MemberStatus
  createTime: string
  lastLoginTime?: string
  orderCount?: number
  totalAmount?: number
  points?: number
  balance?: number
  [key: string]: any
}

export interface MemberSearchParams {
  pageNumber?: number
  pageSize?: number
  username?: string
  mobile?: string
  status?: MemberStatus
  [key: string]: any
}

export interface MemberFormData {
  username: string
  nickName?: string
  mobile: string
  email?: string
  status: MemberStatus
  [key: string]: any
}

