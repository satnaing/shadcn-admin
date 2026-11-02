export type RankingPeriod = 'today' | 'week' | 'month' | 'all'

export type AvatarItem = {
  id: number
  name: string
  avatar?: string | null
}

export type CategoryStat = {
  id: number
  name: string
  total: number
}

export type BrandStat = {
  id: number
  name: string
  total: number
}

export type YearlySaleItem = {
  month: string
  total: number
}

export type DashboardKpis = {
  total_customers: number
  top_customers: AvatarItem[]
  total_products: number
  total_inhouse_products: number
  total_sellers_products: number
  total_categories: number
  top_categories: CategoryStat[]
  total_brands: number
  top_brands: BrandStat[]
  total_sale: number
  sale_this_month: number
  inhouse_sale_this_month: number
  seller_sale_this_month: number
  yearly_sales: YearlySaleItem[]
  total_sellers: number
  total_approved_sellers: number
  total_pending_sellers: number
  top_sellers: AvatarItem[]
}

export type OrderStatusItem = {
  key: string
  label: string
  count: number
  percentage: number
  color: string
}

export type DashboardOrdersPipeline = {
  fulfillment_rate: number
  total_orders: number
  inhouse_orders: number
  inhouse_order_percentage: number
  seller_orders: number
  seller_order_percentage: number
  pipeline: OrderStatusItem[]
}

export type DashboardInhouseStore = {
  fulfillment_rate: number
  total_sales: number
  total_orders: number
  total_products: number
  rating: number
  pipeline: OrderStatusItem[]
}

export type TopProductItem = {
  id: number
  name: string
  slug: string
  image: string | null
  sales: number
  total: number
}

export type TopCategoryGroup = {
  category_id: number
  category_name: string
  cover_image: string | null
  products: TopProductItem[]
}

export type InhouseTopCategory = {
  id: number
  name: string
  cover_image: string | null
  total: number
}

export type InhouseTopBrand = {
  id: number
  name: string
  logo: string | null
  total: number
}

export type TopSellerGroup = {
  seller_id: number
  shop_name: string
  logo: string | null
  products: TopProductItem[]
}

export type TopBrandGroup = {
  brand_id: number
  brand_name: string
  logo: string | null
  products: TopProductItem[]
}

export type DashboardStatsResponse = {
  kpis: DashboardKpis
  orders: DashboardOrdersPipeline
  inhouse_store: DashboardInhouseStore
  top_category_products: Record<RankingPeriod, TopCategoryGroup[]>
  inhouse_top_categories: Record<RankingPeriod, InhouseTopCategory[]>
  inhouse_top_brands: Record<RankingPeriod, InhouseTopBrand[]>
  top_sellers_products: Record<RankingPeriod, TopSellerGroup[]>
  top_brands_products: Record<RankingPeriod, TopBrandGroup[]>
}
