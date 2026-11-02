export interface ReportsOverview {
  total_revenue: number
  admin_earnings: number
  seller_earnings: number
  total_commission: number
  total_orders: number
  total_in_house_sales: number
  total_seller_sales: number
  wallet_recharge_total: number
}

export interface EarningReportItem {
  id: number
  date: string
  admin_earning: number
  seller_earning: number
  total_tax: number
  total_sale: number
  orders_count: number
}

export interface SaleReportItem {
  id: number
  product_id: number
  product_name: string
  thumbnail?: string
  category_name: string
  seller_name?: string
  num_of_sale: number
  total_amount: number
}

export interface StockReportItem {
  id: number
  product_id: number
  product_name: string
  thumbnail?: string
  category_name: string
  current_stock: number
  unit: string
  status: 'in_stock' | 'low_stock' | 'out_of_stock'
}

export interface WishlistReportItem {
  id: number
  product_id: number
  product_name: string
  thumbnail?: string
  category_name: string
  unit_price: number
  wishlist_count: number
}

export interface UserSearchReportItem {
  id: number
  query: string
  search_count: number
  results_count: number
  last_searched_at: string
}

export interface CommissionLogItem {
  id: number
  order_code: string
  seller_name: string
  admin_commission: number
  seller_earning: number
  order_amount: number
  created_at: string
}

export interface WalletHistoryItem {
  id: number
  user_name: string
  user_email: string
  amount: number
  payment_method: string
  status: 'completed' | 'pending' | 'failed'
  created_at: string
}

export interface ReportFilterParams {
  search?: string
  start_date?: string
  end_date?: string
  category_id?: number | string
  seller_id?: number | string
  page?: number
  per_page?: number
}
