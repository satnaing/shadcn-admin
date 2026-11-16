export const ORDER_SOURCES = ['walkin', 'registered', 'facebook', 'whatsapp'] as const
export type PosOrderSource = (typeof ORDER_SOURCES)[number]

export const PAYMENT_TYPES = ['cash', 'cash_on_delivery', 'offline_payment'] as const
export type PosPaymentType = (typeof PAYMENT_TYPES)[number]
export type PosPaymentStatus = 'paid' | 'unpaid'

export interface PosListParams {
  page?: number
  per_page?: number
  sort?: string
  q?: string
  category?: string
  brand?: string
  seller?: string
  tab?: string
}

/** One sellable variant (AEC `product_stocks` row joined with its product). */
export interface PosStockItem {
  id: number
  product_id: number
  name: string
  /** Empty when the product has no variants. */
  variant: string
  price: number
  /** Tax of one unit. */
  tax: number
  stock_qty: number
  min_qty: number
  digital: boolean
  barcode: string | null
  category_id: number
  brand_id: number | null
  image: string | null
}

export interface PosCartLine {
  stock: PosStockItem
  quantity: number
}

export interface PosCustomer {
  id: number
  name: string
  phone: string
  email: string
}

export interface PosAddress {
  id: number
  address: string
  country: string
  state: string
  city: string
  postal_code: string
  phone: string
}

export interface PosGuestInfo {
  name: string
  phone: string
  email: string
  address: string
}

export interface PosOfflinePayment {
  method: string
  amount: number
  trx_id: string
  proof: string | null
}

export interface PosOrderPayload {
  order_source: PosOrderSource
  /** Registered customer; null for walk-in / social orders. */
  customer_id: number | null
  /** Saved address of the registered customer. */
  address_id: number | null
  /** Shipping info typed for everyone else. */
  guest: PosGuestInfo | null
  items: { stock_id: number; quantity: number }[]
  shipping_cost: number
  discount: number
  payment_type: PosPaymentType
  offline: PosOfflinePayment | null
}

export interface PosOrderResult {
  id: number
  code: string
  grand_total: number
}

export interface PosOrderItem {
  id: number
  code: string
  date: string
  customer: string
  source: PosOrderSource
  items_count: number
  grand_total: number
  payment_type: PosPaymentType
  payment_status: PosPaymentStatus
  operator: string
}

/** A product that is switched on for POS (AEC `products.pos = 1`). */
export interface PosProductItem {
  id: number
  name: string
  category_id: number
  category: string
  seller_id: number | null
  seller: string
  unit_price: number
  stock_qty: number
  rating: number
}

export interface PosSettings {
  /** Sellers may use their own terminal. */
  seller_activation: boolean
  /** Thermal printer paper width in mm; the receipt cannot be printed without it. */
  print_width: number | null
}

export interface LookupOption {
  id: number
  name: string
  parent_id: number | null
}

export interface PosLookups {
  categories: { id: number; name: string; depth: number }[]
  brands: { id: number; name: string }[]
  sellers: { id: number; name: string }[]
  countries: LookupOption[]
  states: LookupOption[]
  cities: LookupOption[]
}

export interface ReceiptLink {
  download_url: string
  filename: string
}
