export const MANUAL_TYPES = ['custom_payment', 'bank_payment', 'check_payment'] as const
export type ManualType = (typeof MANUAL_TYPES)[number]

export interface BankRow {
  bank_name: string
  account_name: string
  account_number: string
  routing_number: string
}

/** AEC `manual_payment_methods`: `bank_info` (JSON column) is a real array and only used by `bank_payment`. */
export interface ManualMethod {
  id: number
  type: ManualType
  heading: string
  description: string
  photo: string | null
  bank_info: BankRow[]
}

export const ORDER_PAYMENT_STATUSES = ['submitted', 'paid', 'unpaid'] as const
export type OrderPaymentStatus = (typeof ORDER_PAYMENT_STATUSES)[number]

/** An order paid offline (AEC `orders.manual_payment = 1` + `manual_payment_data`). */
export interface OfflineOrder {
  id: number
  code: string
  customer: string
  method: string
  amount: number
  trx_id: string
  receipt: string | null
  payment_status: OrderPaymentStatus
  created_at: string
}

export const WALLET_TABS = ['all', 'pending', 'approved', 'by_admin', 'by_customer'] as const
export type WalletTab = (typeof WALLET_TABS)[number]

export interface WalletRequest {
  id: number
  customer: string
  amount: number
  method: string | null
  trx_id: string
  receipt: string | null
  approved: boolean
  added_by: 'admin' | 'customer'
  created_at: string
}

export type PackageKind = 'seller' | 'customer'

export interface PackageRequest {
  id: number
  customer: string
  /** `null` when the package was deleted afterwards (AEC prints "Package Unavailable"). */
  package: string | null
  method: string
  trx_id: string
  receipt: string | null
  approved: boolean
  created_at: string
}

export const PAYOUT_TYPES = ['bank_payment', 'others'] as const
export type PayoutType = (typeof PAYOUT_TYPES)[number]

export interface PayoutMethod {
  id: number
  type: PayoutType
  name: string
  logo: string | null
  created_at: string
}

export const PAYRIFF_MODES = ['test', 'production'] as const
export type PayriffMode = (typeof PAYRIFF_MODES)[number]

/** Secret values come back as this mask; sending the mask unchanged keeps the stored secret. */
export const SECRET_MASK = '********'

export interface PayriffSettings {
  active: boolean
  display_name: string
  mode: PayriffMode
  test_merchant_id: string
  test_secret_key: string
  production_merchant_id: string
  production_secret_key: string
}

export interface CustomerLookup {
  id: number
  name: string
  email: string
}

export interface RechargePayload {
  user_id: number
  amount: number
  trx_id: string
  photo: string
}

export interface PaymentsListParams {
  page?: number
  per_page?: number
  sort?: string
  q?: string
  tab?: string
}
