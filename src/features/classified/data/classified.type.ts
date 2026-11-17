export const LOCALES = ['az', 'en', 'tr', 'ru'] as const
export type Locale = (typeof LOCALES)[number]

/** One listing created by a customer or a seller (AEC `customer_products`). */
export interface ClassifiedProduct {
  id: number
  name: string
  thumbnail: string | null
  /** Uploader's display name. */
  owner: string
  /** Owner's own switch ("Customer status" in AEC); the admin cannot change it. */
  is_active: boolean
  /** Admin moderation switch: only published listings reach the storefront. */
  is_published: boolean
  created_at: string
}

/** A package customers buy to get more listing uploads (AEC `customer_packages`). */
export interface ClassifiedPackage {
  id: number
  name: string
  translations: Record<Locale, string>
  amount: number
  product_upload: number
  logo: string
}

export interface ClassifiedListParams {
  page?: number
  per_page?: number
  q?: string
  sort?: string
}
