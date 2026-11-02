export type ClassifiedCreatorType = 'admin' | 'seller'
export type ClassifiedCondition = 'new' | 'used'

export interface ClassifiedProductItem {
  id: number
  name: string
  creator_type: ClassifiedCreatorType
  creator_name: string
  creator_email?: string
  category: string
  category_id?: number
  brand_id?: number | null
  brand_name?: string
  unit?: string
  condition: ClassifiedCondition
  unit_price: number
  purchase_price?: number
  discount?: number
  discount_type?: 'flat' | 'percent'
  tax?: number
  current_stock?: number
  sku?: string
  is_published: boolean
  featured?: boolean
  thumbnail?: string
  photos?: string[]
  video_link?: string
  description?: string
  tags?: string
  location?: string
  phone?: string
  shipping_cost?: number
  est_shipping_days?: number
  meta_title?: string
  meta_description?: string
  created_at: string
}

export interface ClassifiedFilterParams {
  search?: string
  creator_type?: 'all' | ClassifiedCreatorType
  condition?: 'all' | ClassifiedCondition
  category?: string
  page?: number
  per_page?: number
}
