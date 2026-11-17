export const LOCALES = ['az', 'en', 'tr', 'ru'] as const
export type Locale = (typeof LOCALES)[number]

export const SUPPORT_PRIORITIES = ['low', 'normal', 'high'] as const
export type SupportPriority = (typeof SUPPORT_PRIORITIES)[number]

/** Whole-number limits beyond AEC's product upload count (target model D22); -1 = unlimited. */
export const EXTRA_LIMITS = [
  'digital_product_limit',
  'staff_limit',
  'storage_mb',
  'flash_deal_limit',
  'coupon_limit',
  'promo_product_limit',
  'featured_slots',
  'monthly_order_limit',
] as const
export type ExtraLimit = (typeof EXTRA_LIMITS)[number]

export const FEATURE_FLAGS = [
  'wholesale_enabled',
  'shop_design_enabled',
  'pos_enabled',
  'custom_domain_enabled',
] as const
export type FeatureFlag = (typeof FEATURE_FLAGS)[number]

/** A subscription package sellers buy (AEC `seller_packages`). */
export type SellerPackage = {
  id: number
  /** Default-language name (AEC `seller_packages.name`). */
  name: string
  translations: Record<Locale, string>
  amount: number
  /** Validity in days. */
  duration: number
  product_upload_limit: number
  /** Only meaningful while the preorder module is on. */
  preorder_product_upload_limit: number
  logo: string
  /** Computed: shops currently on this package. */
  sellers_count: number
  support_priority: SupportPriority
} & Record<ExtraLimit, number> &
  Record<FeatureFlag, boolean>
