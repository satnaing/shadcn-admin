export interface SellerItem {
  id: number
  name: string
  slug: string
  logo?: string
  seller_name: string
  seller_email: string
  seller_phone: string
  products_count: number
  orders_count: number
  balance: number
  rating: number
  followers_count: number
  is_verified: boolean
  is_approved: boolean
  is_banned: boolean
  created_at: string
}

export interface PayoutRequestItem {
  id: number
  seller_id: number
  shop_name: string
  amount: number
  payment_method: string
  status: 'pending' | 'paid' | 'rejected'
  message?: string
  date: string
}

export interface CommissionRuleItem {
  id: number
  name: string
  store_id?: number | null
  seller_id?: number | null
  category_id?: number | null
  brand_id?: number | null
  category_name?: string
  brand_name?: string
  rate_percentage: number
  priority: number
}

export interface SellerPackageItem {
  id: number
  name: string
  amount: number
  product_upload_limit: number
  duration_days: number
  logo?: string
  status: boolean
}

export interface VerificationFieldItem {
  id: number
  label: string
  type: 'text' | 'file' | 'select' | 'checkbox'
  is_required: boolean
  options?: string[]
}

export interface SellerFilterParams {
  search?: string
  is_approved?: boolean | 'all'
  is_verified?: boolean | 'all'
  is_banned?: boolean | 'all'
  page?: number
  per_page?: number
}
