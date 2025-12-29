// 促销活动相关类型定义

export type PromotionType = 'DISCOUNT' | 'COUPON' | 'FULL_REDUCTION' | 'GIFT'
export type PromotionStatus = 'ACTIVE' | 'INACTIVE' | 'EXPIRED'

export interface PromotionItem {
  id: string
  name: string
  type: PromotionType
  status: PromotionStatus
  startTime: string
  endTime: string
  description?: string
  discount?: number
  minAmount?: number
  maxAmount?: number
  createTime?: string
  [key: string]: any
}

export interface PromotionSearchParams {
  pageNumber?: number
  pageSize?: number
  name?: string
  type?: PromotionType
  status?: PromotionStatus
  [key: string]: any
}

export interface PromotionFormData {
  name: string
  type: PromotionType
  status: PromotionStatus
  startTime: string
  endTime: string
  description?: string
  discount?: number
  minAmount?: number
  maxAmount?: number
  [key: string]: any
}

