export const LOCALES = ['az', 'en', 'tr', 'ru'] as const
export type Locale = (typeof LOCALES)[number]
export type OwnerType = 'admin' | 'seller'
/** One workflow step: not started → pending → accepted or denied (AEC 0/1/2/3). */
export type StepStatus = 'none' | 'pending' | 'accepted' | 'denied'
export type DiscountType = 'flat' | 'percent'

export const ORDER_SCOPES = [
  'all',
  'inhouse',
  'seller',
  'delayed_prepayment',
  'delayed_final',
] as const
export type OrderScope = (typeof ORDER_SCOPES)[number]
export const ORDER_STATUSES = [
  'all',
  'requested',
  'accepted_requests',
  'prepayment_requests',
  'confirmed_prepayments',
  'final_preorders',
  'in_shipping',
  'delivered',
  'refund',
] as const
export type OrderStatusFilter = (typeof ORDER_STATUSES)[number]
/** Workflow order; each step needs the previous one accepted. */
export const ORDER_STEPS = [
  'request',
  'prepayment',
  'final',
  'shipping',
  'delivery',
  'refund',
] as const
export type OrderStep = (typeof ORDER_STEPS)[number]

export interface PreorderListParams {
  q?: string
  page?: number
  per_page?: number
  sort?: string
  [key: string]: string | number | undefined
}

export interface OrderListItem {
  id: number
  code: string
  product_name: string
  product_image: string
  customer_name: string
  owner_type: OwnerType
  owner_name: string
  quantity: number
  grand_total: number
  prepayment_amount: number
  is_refundable: boolean
  steps: Record<OrderStep, StepStatus>
  is_viewed: boolean
  created_at: string
}

export interface OrderDetail extends OrderListItem {
  customer_email: string
  customer_phone: string
  address: string
  unit_price: number
  subtotal: number
  tax: number
  shipping_cost: number
  coupon_discount: number
  product_discount: number
  is_prepayment: boolean
  request_note: string
  step_notes: Record<OrderStep, string>
  step_at: Record<OrderStep, string | null>
  shipping_proof: string
}

export type OrderCounts = Record<OrderStatusFilter, number>

export interface StepPayload {
  status: 'accepted' | 'denied'
  note?: string
  proof?: string
}

export interface CommissionItem {
  id: number
  order_code: string
  seller_name: string
  admin_commission: number
  seller_earning: number
  created_at: string
}

export interface ProductListItem {
  id: number
  name: string
  image: string
  owner_type: OwnerType
  owner_name: string
  category_name: string
  unit_price: number
  discount_type: DiscountType
  discount: number
  is_prepayment: boolean
  prepayment_type: DiscountType
  prepayment_amount: number
  is_refundable: boolean
  min_qty: number
  available_date: string
  orders_count: number
  is_published: boolean
  is_featured: boolean
  is_show_on_homepage: boolean
  approval: 'approved' | 'pending'
  created_at: string
}

export type ProductFlag =
  | 'is_published'
  | 'is_featured'
  | 'is_show_on_homepage'
  | 'approval'

export interface LookupOption {
  id: number
  name: string
}
export interface Lookups {
  categories: LookupOption[]
  brands: LookupOption[]
  notes: LookupOption[]
}

export interface TopProduct {
  id: number
  name: string
  image: string
  quantity: number
}
export interface DashboardStats {
  products_total: number
  products_live: number
  inhouse_sales: number
  seller_sales: number
  month_sales: number
  in_shipping: number
  delivered: number
  requests: number
  accepted_requests: number
  prepayment_requests: number
  confirmed_prepayments: number
  final_preorders: number
  delayed_prepayment: number
  delayed_final: number
  monthly_sales: number[]
}

export interface ConversationItem {
  id: number
  title: string
  product_name: string
  sender_name: string
  receiver_name: string
  last_message_at: string
}
export interface ConversationMessage {
  id: number
  sender_name: string
  is_admin: boolean
  message: string
  created_at: string
}
export interface ConversationDetail extends ConversationItem {
  messages: ConversationMessage[]
}

export interface QueryItem {
  id: number
  product_name: string
  customer_name: string
  question: string
  reply: string | null
  created_at: string
}

export interface ReviewProductItem {
  id: number
  product_name: string
  owner_name: string
  rating: number
  reviews_count: number
  has_new: boolean
}
export interface ReviewItem {
  id: number
  customer_name: string
  rating: number
  comment: string
  is_published: boolean
  created_at: string
}
export interface ReviewProductDetail {
  product_name: string
  reviews: ReviewItem[]
}

export interface FaqItem {
  id: number
  question: string
  answer: string
  translations: Record<Locale, { question: string; answer: string }>
  is_active: boolean
}

export const NOTIFICATION_USERS = ['customer', 'seller', 'admin'] as const
export type NotificationUser = (typeof NOTIFICATION_USERS)[number]
export interface NotificationTypeItem {
  id: number
  user_type: NotificationUser
  type: string
  name: string
  default_text: string
  image: string
  translations: Record<Locale, { name: string; default_text: string }>
  is_active: boolean
}

export interface PreorderSettings {
  allow_seller_products: boolean
  seller_commission: number
  faq_banner: string
  flat_shipping_rate: number
  request_instruction: string
  payment_qr: string
  prepayment_instruction: string
}

export interface DownloadLink {
  download_url: string
  filename: string
}
