// Align with DB Enums
export enum DiscountType {
  FIXED = 'FIXED', // e.g., $5 off
  PERCENTAGE = 'PERCENTAGE', // e.g., 10% off
  FIXED_PRICE = 'FIXED_PRICE', // e.g., Buy for $10
  STAMP_PER_ITEM = 'STAMP_PER_ITEM', // e.g., 1 stamp per item
}

export enum PromotionScope {
  CART = 'CART', // Applies to total
  CATEGORY = 'CATEGORY',
  PRODUCT = 'PRODUCT',
  MIXED = 'MIXED',
}

export interface PromotionResponse {
  data: Promotion[]
  meta: {
    totalItems: number
    itemCount: number
    itemsPerPage: number
    totalPages: number
    currentPage: number
  }
}

export interface Promotion {
  id: string
  name: { en: string; km?: string } | string
  description?: { en: string; km?: string } | string
  code?: string // e.g., "SUMMER2025"
  type: DiscountType
  value: number | string // Decimal in DB, sometimes returns as string
  scope: PromotionScope
  targetSku?: string // Only if scope is PRODUCT
  startDate?: string // Mapped from validFrom
  endDate?: string // Mapped from validUntil
  validFrom?: string
  validUntil?: string
  budgetLimitAmount?: number
  totalAmountBurned?: number // Usage tracking — may be absent from API
  isActive?: never // Removed from API
  status: 'ACTIVE' | 'INACTIVE' | 'ARCHIVED' | null
  isFeatured?: boolean
  bannerUrl?: Record<string, string>

  // New fields from API
  rules?: Record<string, unknown>[]
  actions?: Record<string, unknown>[]
  applicationType?: 'AUTOMATIC' | 'PUBLIC' | 'HIDDEN'
  strategyType?: 'STACKABLE' | 'BEST_DEAL'
  isVoucherRequired?: boolean
  rewardProductId?: string
  daysOfWeek?: string[]
  startTime?: string
  endTime?: string
  usageLimitType?: string
  usageLimitValue?: number
}

export type CustomerStatus = 'ACTIVE' | 'BANNED' | 'PENDING'

export interface Customer {
  id: string
  fullName: string
  phone: string
  email: string | null
  gender: string | null
  profileImageUrl: string | null
  status: 'ACTIVE' | 'BANNED' | 'PENDING'
  dob: string | null
  referralCode: string
  referredByUserId: string | null
  membershipTierId: string | null
  createdAt: string
  updatedAt: string
}

export interface Voucher {
  id: string
  uniqueCode: string // The specific code user types
  promotionName: string // Joined from Promotion
  userPhone: string // Joined from User
  isRedeemed: boolean
  createdAt: string
}

export type ReviewTarget = 'SHOP' | 'PRODUCT'

export interface ReviewReply {
  text: string
  createdAt: string
}

export interface Review {
  id: string
  shopId: string
  authorName: string // From customer join
  rating: number // 1-5
  content: string
  tags: string[]

  targetType: ReviewTarget
  targetName: string // "Shop 01" or "Cappuccino"

  reply?: ReviewReply | null

  createdAt: string
}
