import { type DiscountType, type PromotionScope } from '@/types/growth'

// --- ViewModel (User Intent) ---

export type PromotionIntentMode =
  | 'ITEM_MARKDOWN' // "Everything in [Category] is [20%] off"
  | 'VOLUME_INCENTIVE' // "Buy [2] of [Product] to get [10%] off"
  | 'CART_REWARD' // "Spend [$50] to get [$5] off"

export interface BasePromotionState {
  mode: PromotionIntentMode
  name: string
  description?: string
  code?: string
  startDate?: string
  endDate?: string
  budgetLimitAmount?: number
  excludeDirty: boolean // Default true for Markdown/Volume
  targetScope?: 'ALL' | 'SPECIFIC' // ALL = store-wide, SPECIFIC = pick items
  priority: number
  isFeatured: boolean
  bannerUrl?: Record<string, string>

  // Strategy
  isStackable?: boolean // Controls strategyType: true = STACKABLE, false = BEST_DEAL

  // Activation System
  applicationType?: 'AUTOMATIC' | 'PUBLIC' | 'HIDDEN'
  isVoucherRequired?: boolean

  // Display only
  searchQuery?: string
  // Usage Limits
  usageLimitType?: 'none' | 'ORDER' | 'ACCOUNT'
  usageLimitValue?: number

  // Shared / Optional fields for Form polymorphism
  targets?: SearchResultItem[]
  excludedTargets?: SearchResultItem[]
  discountType?: DiscountType
  discountValue?: number
  minQuantity?: number
  minSubtotal?: number
  minMemberCount?: number // For MEMBER_COUNT rule
  rewardTarget?: SearchResultItem
}

// Mode 1: Item Markdown (Simple Sale OR Category PWP)
// Trigger: PRODUCT_QUANTITY >= 1 (Implicit)
// Action: PERCENTAGE or FIXED_AMOUNT off Key Items OR Unlock Reward
export interface ItemMarkdownState extends BasePromotionState {
  mode: 'ITEM_MARKDOWN'
  targets: SearchResultItem[] // Categories or Products (trigger)
  discountType:
    | DiscountType.PERCENTAGE
    | DiscountType.FIXED
    | DiscountType.FIXED_PRICE
    | DiscountType.STAMP_PER_ITEM
  discountValue: number
  // For Category-level PWP:
  rewardMode?: 'UNLOCK'
  rewardTargets?: SearchResultItem[] // Reward products
  rewardQuantity?: number // Max quantity limit
}

// Mode 2: Volume Incentive (BOGO / Bulk)
// Trigger: PRODUCT_QUANTITY >= X
// Action: PERCENTAGE or FIXED_AMOUNT off Key Items OR (Future) Free Item
export interface VolumeIncentiveState extends BasePromotionState {
  mode: 'VOLUME_INCENTIVE'
  targets: SearchResultItem[] // Trigger Items
  minQuantity: number // "Buy [2]"
  discountType:
    | DiscountType.PERCENTAGE
    | DiscountType.FIXED
    | DiscountType.FIXED_PRICE
    | DiscountType.STAMP_PER_ITEM
  discountValue: number
  // For PWP / Unlock Reward:
  rewardMode?: 'BUNDLE' | 'UNLOCK'
  rewardTargets?: SearchResultItem[] // Changed from single rewardTarget
  rewardQuantity?: number // "Limit"
}

// Mode 3: Cart Reward (Threshold)
// Trigger: CART_SUBTOTAL >= X
// Action: FIXED_AMOUNT off Total
export interface CartRewardState extends BasePromotionState {
  mode: 'CART_REWARD'
  minSubtotal: number // "Spend [$50]"
  discountValue: number // "Get [$5] off" or "Get [Item] for $10"

  // Extended for Cart PWP
  discountType?:
    | DiscountType.PERCENTAGE
    | DiscountType.FIXED
    | DiscountType.FIXED_PRICE
    | DiscountType.STAMP_PER_ITEM
  rewardMode?: 'UNLOCK' // Only UNLOCK is relevant for Cart PWP
  rewardTargets?: SearchResultItem[]
  rewardQuantity?: number
  // Multi-Tier
  tiers?: { threshold: number; value: number; label?: string }[]
  // Group Orders
  minMemberCount?: number // For MEMBER_COUNT rule
}

export type PromotionViewModel =
  | ItemMarkdownState
  | VolumeIncentiveState
  | CartRewardState

// --- Utilities for Component Props ---

export interface SearchResultItem {
  id: string
  type: 'PRODUCT' | 'CATEGORY' | 'COLLECTION'
  name: string
  price?: number
  subtitle?: string // SKU or Parent Category
}

// --- DTO Mapping (Output) ---

export interface PromotionTier {
  threshold: number
  rewardValue: number
  rewardType:
    | 'DISCOUNT_PERCENTAGE'
    | 'DISCOUNT_FIXED'
    | 'SET_FIXED_PRICE'
    | 'UNLOCK_PRODUCT'
}

export interface PromotionRule {
  type:
    | 'CART_SUBTOTAL'
    | 'ITEM_QTY'
    | 'MEMBER_COUNT'
    | 'HAS_PRODUCT'
    | 'TIERED_SUBTOTAL'
    | 'TIERED_ITEM_QTY'
  operator?: 'GTE' | 'LTE' | 'EQ' // Defaults to GTE
  value: number // Threshold (ignored for TIERED rules)
  targetIds?: string[]
  excludeDirty?: boolean
  tiers?: PromotionTier[] // For TIERED_* rules
}

export interface PromotionAction {
  type:
    | 'DISCOUNT_PERCENTAGE'
    | 'DISCOUNT_FIXED'
    | 'SET_FIXED_PRICE'
    | 'UNLOCK_PRODUCT'
  value: number
  targetIds?: string[]
  maxQty?: number
}

export interface CreatePromotionDto {
  name: Record<string, string> // LocalizedText
  description?: Record<string, string>
  type: DiscountType
  value: number
  scope: PromotionScope
  status?: 'ACTIVE' | 'INACTIVE' | 'ARCHIVED'
  startDate?: string
  endDate?: string
  budgetLimitAmount?: number
  // sku removed as it's not in spec, but 'code' is for PUBLIC. keeping if needed or mapping code -> code
  code?: string
  isFeatured?: boolean
  bannerUrl?: Record<string, string>

  // Targeting Fields (Mixed Scope & Legacy support if needed, but spec emphasizes include*)
  includeProducts?: string[]
  includeCategories?: string[]
  includeCollections?: string[]
  excludeProducts?: string[]
  excludeCategories?: string[]
  excludeCollections?: string[]

  // Rules Engine Fields
  strategyType?: 'STACKABLE' | 'BEST_DEAL'
  applicationType?: 'AUTOMATIC' | 'PUBLIC' | 'HIDDEN'
  isVoucherRequired?: boolean
  rewardProductId?: string // UUID — Required only for UNLOCK_PRODUCT

  rules: PromotionRule[]
  actions: PromotionAction[]
}
