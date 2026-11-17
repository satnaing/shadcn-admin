export type Owner = 'admin' | 'seller'
export type ProductFlag =
  | 'is_published'
  | 'is_featured'
  | 'is_todays_deal'
  | 'is_approved'

/** One quantity band of the wholesale price (AEC `wholesale_prices`). */
export interface WholesaleTier {
  min_qty: number
  max_qty: number
  price: number
}

/** Row of the wholesale product table. */
export interface WholesaleProduct {
  id: number
  name: string
  thumbnail: string | null
  owner_type: Owner
  owner_id: number
  owner_name: string
  num_of_sale: number
  unit_price: number
  rating: number
  stock: number
  low_stock_quantity: number
  tiers_count: number
  is_published: boolean
  is_featured: boolean
  is_todays_deal: boolean
  /** Seller products wait for admin approval; in-house products are always approved. */
  is_approved: boolean
  created_at: string
}

export interface NamedOption {
  id: number
  name: string
}

export interface WholesaleLookups {
  categories: NamedOption[]
  brands: NamedOption[]
  units: NamedOption[]
  /** In-house owner + every seller, for the seller filter. */
  sellers: NamedOption[]
}

export interface WholesaleListParams {
  page?: number
  per_page?: number
  q?: string
  sort?: string
  owner?: string
  seller?: string
}
