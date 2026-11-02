export interface FlashDealItem {
  id: number
  title: string
  start_date: string
  end_date: string
  status: boolean
  featured: boolean
  background_color?: string
  banner?: string
  slug: string
  products_count: number
}

export type CouponType = 'product_base' | 'cart_base' | 'welcome_base'

export interface CouponItem {
  id: number
  type: CouponType
  code: string
  discount: number
  discount_type: 'amount' | 'percent'
  start_date: string
  end_date: string
  min_buy: number
  max_discount?: number
  usage_limit?: number
  used_count: number
  status: boolean
}

export interface CategoryDiscountItem {
  id: number
  category_id: number
  category_name: string
  discount: number
  discount_type: 'amount' | 'percent'
  status: boolean
}

export interface PromotionalProductItem {
  id: number
  name: string
  thumbnail?: string
  category_name: string
  original_price: number
  discounted_price: number
  deal_title: string
  seller_name?: string
  added_by: 'admin' | 'seller'
  status: boolean
}
