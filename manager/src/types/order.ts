// 订单相关类型定义

export type OrderStatus = 'UNPAID' | 'PAID' | 'SHIPPED' | 'COMPLETED' | 'CANCELLED'
export type PayStatus = 'PAID' | 'UNPAID'

export interface OrderItem {
  id: string
  orderSn: string
  memberId?: string
  memberName: string
  orderPrice: number
  orderStatus: OrderStatus
  payStatus: PayStatus
  shipStatus?: boolean
  paymentMethod?: string
  createTime: string
  payTime?: string
  shipTime?: string
  address?: OrderAddress
  items?: OrderGoodsItem[]
  remark?: string
  [key: string]: any
}

export interface OrderAddress {
  name?: string
  mobile?: string
  province?: string
  city?: string
  county?: string
  detail?: string
  [key: string]: any
}

export interface OrderGoodsItem {
  id?: string
  goodsId?: string
  goodsName: string
  small?: string
  price: number
  num: number
  [key: string]: any
}

export interface OrderSearchParams {
  pageNumber?: number
  pageSize?: number
  orderSn?: string
  memberName?: string
  orderStatus?: OrderStatus
  payStatus?: PayStatus
  [key: string]: any
}

export interface ShipFormData {
  logisticsCompany: string
  logisticsNo: string
  remark?: string
}

export interface RefundFormData {
  refundAmount: number
  refundReason: 'QUALITY' | 'DESCRIPTION' | 'UNWANTED' | 'OTHER'
  refundRemark: string
}

