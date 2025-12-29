// 商品相关类型定义

export interface GoodsItem {
  id: string
  goodsId?: string
  goodsName: string
  categoryId?: string
  categoryName?: string
  price: number
  stock: number
  sales: number
  goodsStatus: 'UPPER' | 'LOWER'
  small?: string
  images?: string[]
  intro?: string
  content?: string
  createTime?: string
  updateTime?: string
  [key: string]: any
}

export interface CategoryItem {
  id: string
  name: string
  parentId?: string
  level?: number
  children?: CategoryItem[]
  [key: string]: any
}

export interface GoodsSearchParams {
  pageNumber?: number
  pageSize?: number
  goodsName?: string
  categoryId?: string
  goodsStatus?: 'UPPER' | 'LOWER'
  [key: string]: any
}

export interface GoodsFormData {
  goodsName: string
  categoryId: string
  price: number
  stock: number
  intro?: string
  content?: string
  small?: string
  images?: string[]
  goodsStatus: 'UPPER' | 'LOWER'
  [key: string]: any
}

