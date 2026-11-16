export type AffiliateOptionType =
  | 'user_registration_first_purchase'
  | 'product_sharing'
  | 'category_wise_affiliate'
export type CommissionType = 'amount' | 'percent'
export type PayMethod = 'Paypal' | 'Bank'
export type WithdrawStatus = 'pending' | 'approved' | 'rejected'
export type ElementType = 'text' | 'select' | 'multi_select' | 'radio' | 'file'
export type AffiliateListKind = 'users' | 'referrals' | 'withdraws' | 'logs'

export const PAY_METHODS: PayMethod[] = ['Paypal', 'Bank']
export const ELEMENT_TYPES: ElementType[] = [
  'text',
  'select',
  'multi_select',
  'radio',
  'file',
]
export const CHOICE_TYPES: ElementType[] = ['select', 'multi_select', 'radio']
export const OPTION_TYPES: AffiliateOptionType[] = [
  'user_registration_first_purchase',
  'product_sharing',
  'category_wise_affiliate',
]
export const USER_TABS = ['all', 'pending', 'approved'] as const
export const WITHDRAW_TABS = ['all', 'pending', 'approved', 'rejected'] as const
export const LOG_TABS = ['all', ...OPTION_TYPES] as const

export interface AffiliateListParams {
  page?: number
  per_page?: number
  sort?: string
  q?: string
  tab?: string
}

export interface AffiliateSettings {
  minimum_withdraw_amount: number
  validation_days: number
}

export interface FirstPurchaseOption {
  status: boolean
  percentage: number
}
export interface ProductSharingOption {
  status: boolean
  commission: number
  commission_type: CommissionType
}
export interface CategoryCommission {
  category_id: number
  category_name: string
  commission: number
  commission_type: CommissionType
}
export interface CategoryWiseOption {
  status: boolean
  items: CategoryCommission[]
}
export interface AffiliateOptions {
  user_registration_first_purchase: FirstPurchaseOption
  product_sharing: ProductSharingOption
  category_wise_affiliate: CategoryWiseOption
}

export interface FormElement {
  type: ElementType
  label: string
  options: string[]
}

export interface AffiliateUserItem {
  id: number
  name: string
  email: string
  phone: string
  is_approved: boolean
  has_verification: boolean
  balance: number
  created_at: string
}

export interface VerificationEntry {
  type: 'text' | 'select' | 'multi_select' | 'file'
  label: string
  /** Plain text, a list for multi-select, or a file URL. */
  value: string | string[]
}

export interface AffiliateUserDetail extends AffiliateUserItem {
  address: string
  paypal_email: string
  bank_information: string
  verification: VerificationEntry[]
}

export interface AffiliatePayment {
  id: number
  amount: number
  payment_method: PayMethod
  created_at: string
}

export interface ReferralItem {
  id: number
  name: string
  email: string
  phone: string
  referred_by_name: string | null
}

export interface WithdrawItem {
  id: number
  affiliate_user_id: number
  name: string
  email: string
  amount: number
  status: WithdrawStatus
  paypal_email: string
  bank_information: string
  requested_at: string
}

export interface AffiliateLogItem {
  id: number
  referred_by_name: string
  referral_name: string | null
  guest_id: string | null
  amount: number
  order_code: string
  affiliate_type: AffiliateOptionType
  product_name: string | null
  created_at: string
}
