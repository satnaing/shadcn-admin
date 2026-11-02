export type WholesaleTier = {
  min_qty: number
  price: number
}

export type ProductItem = {
  id: number
  name: string
  slug: string
  category_id: number
  category_name?: string
  brand_id: number | null
  brand_name?: string | null
  user_id: number
  added_by: 'admin' | 'seller'
  seller_name?: string | null
  unit: string
  unit_price: number
  purchase_price: number | null
  discount: number
  discount_type: 'amount' | 'percent'
  current_stock: number
  thumbnail_img: string | null
  published: boolean
  approved: boolean
  featured: boolean
  todays_deal: boolean
  rating: number
  num_of_sale: number
  wholesale_prices?: WholesaleTier[]
  [key: string]: unknown
}

export type ProductFormData = {
  name: string
  category_id: number
  brand_id: number | null
  unit: string
  unit_price: number
  purchase_price?: number
  discount?: number
  discount_type?: 'amount' | 'percent'
  current_stock: number
  thumbnail_img?: string
  photos?: string[]
  published?: boolean
  featured?: boolean
  todays_deal?: boolean
  min_qty?: number
  barcode?: string
  refundable?: boolean
  tags?: string
  video_provider?: string
  video_link?: string
  tax?: number
  tax_type?: 'flat' | 'percent'
  sku?: string
  description?: string
  shipping_type?: 'free' | 'flat_rate' | 'standard'
  shipping_cost?: number
  est_shipping_days?: number
  meta_title?: string
  meta_description?: string
  meta_image?: string
  wholesale_prices?: WholesaleTier[]
}

export type ProductReviewItem = {
  id: number
  product_id: number
  product_name: string
  customer_name: string
  rating: number
  comment: string
  status: boolean
  created_at: string
}
