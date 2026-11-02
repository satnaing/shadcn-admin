export interface CustomerItem {
  id: number
  name: string
  email: string
  phone: string
  avatar?: string
  package_name?: string
  balance: number
  is_verified: boolean
  is_banned: boolean
  orders_count: number
  total_spent: number
  created_at: string
}

export interface CustomerFilterParams {
  search?: string
  is_verified?: boolean | 'all'
  is_banned?: boolean | 'all'
  page?: number
  per_page?: number
}

export interface ClassifiedProductItem {
  id: number
  name: string
  customer_name: string
  customer_email?: string
  added_by?: 'admin' | 'seller'
  category: string
  condition: 'new' | 'used'
  unit_price: number
  is_published: boolean
  thumbnail?: string
  created_at: string
}

export interface CustomerPackageItem {
  id: number
  name: string
  amount: number
  product_upload: number
  logo?: string
  status: boolean
}
