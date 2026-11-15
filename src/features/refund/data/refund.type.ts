export type RefundDecision = 'pending' | 'approved' | 'rejected' | 'na'
export type RefundStatus = 'pending' | 'approved' | 'rejected'
export type PaymentChannel = 'wallet' | 'offline'
export type ReasonKind = 'customer' | 'rejection'
export type RefundKind = 'refund' | 'dispute'
export type ApprovalMode = 'admin_approval' | 'seller_direct'
export type RefundType = 'global' | 'category'

export const REFUND_TABS = ['all', 'admin', 'seller', 'pending', 'approved', 'rejected', 'wallet', 'offline'] as const
export type RefundTab = (typeof REFUND_TABS)[number]
export const REASON_KINDS: ReasonKind[] = ['customer', 'rejection']
export const LOCALES = ['az', 'en', 'tr', 'ru'] as const
export type Locale = (typeof LOCALES)[number]

export interface PaymentInfo {
  method: string
  account_name: string
  account_number: string
  note: string
}

/** The customer's second attempt after a rejection (AEC "dispute refund"). */
export interface DisputeInfo {
  status: RefundStatus
  reason: string
  images: string[]
  requested_at: string
  decided_at: string | null
  reject_reason: string | null
  transaction_id: string | null
  receipt: string | null
}

export interface RefundListItem {
  id: number
  code: string
  order_code: string
  product_name: string
  product_image: string
  customer_name: string
  seller_name: string
  seller_type: 'admin' | 'seller'
  amount: number
  payment_channel: PaymentChannel
  seller_decision: RefundDecision
  admin_decision: RefundDecision
  status: RefundStatus
  requested_at: string
  dispute_status: RefundStatus | null
}

export interface RefundDetail extends RefundListItem {
  reason: string
  images: string[]
  payment_info: PaymentInfo | null
  paid_at: string | null
  decided_at: string | null
  reject_reason: string | null
  transaction_id: string | null
  receipt: string | null
  dispute: DisputeInfo | null
}

export interface ReasonItem {
  id: number
  kind: ReasonKind
  reason: string
  translations: Record<Locale, string>
  is_active: boolean
  created_at: string
}

export interface CategoryRefundItem {
  id: number
  name: string
  parent_name: string | null
  icon: string
  refund_days: number
}

export interface RefundSettings {
  approval_mode: ApprovalMode
  refund_type: RefundType
  refund_days: number
  dispute_enabled: boolean
  dispute_days: number
  sticker: string
}

export type RefundListParams = Record<string, string | number | undefined>
