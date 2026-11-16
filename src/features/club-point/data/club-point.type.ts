export type ConvertStatus = 'pending' | 'converted'
export const EARNING_TABS = ['all', 'pending', 'converted'] as const

export interface ClubPointListParams {
  page?: number
  per_page?: number
  sort?: string
  q?: string
  tab?: string
}

/** Points a customer earned from one order. */
export interface EarningItem {
  id: number
  order_code: string | null
  customer_name: string | null
  points: number
  convert_status: ConvertStatus
  created_at: string
}

/** Points of one product line of the order. */
export interface EarningLine {
  id: number
  product_name: string | null
  points: number
  created_at: string
}

export interface EarningDetail extends EarningItem {
  lines: EarningLine[]
}

export interface ProductPointItem {
  id: number
  name: string
  owner: string | null
  unit_price: number
  earn_point: number
}

/** Points that equal one unit of the store currency when converted to wallet money. */
export interface ClubPointSettings {
  convert_rate: number
}

export interface RangePayload {
  point: number
  min_price: number
  max_price: number
}
