export const DELIVERY_STAGES = [
  'assigned',
  'pickup',
  'on_the_way',
  'completed',
  'pending',
  'cancelled',
] as const
export type DeliveryStage = (typeof DELIVERY_STAGES)[number]

export type DeliveryStatus =
  | 'pending'
  | 'confirmed'
  | 'picked_up'
  | 'on_the_way'
  | 'delivered'
  | 'cancelled'
export type PaymentType = 'cash_on_delivery' | 'prepaid'
export type PaymentKind = 'salary' | 'commission'

export interface CourierListParams {
  page?: number
  per_page?: number
  sort?: string
  q?: string
  tab?: string
}

export interface CourierItem {
  id: number
  name: string
  email: string
  phone: string
  banned: boolean
  /** Owed to the courier (commission / salary not yet paid out). */
  total_earning: number
  /** Cash the courier holds from cash-on-delivery orders. */
  total_collection: number
  created_at: string
}

export interface CourierDetail extends CourierItem {
  avatar: string | null
  address: string
  country_id: number
  state_id: number
  city_id: number
}

/** A payout to a courier or a cash collection from one (same shape, separate tables). */
export interface SettlementItem {
  id: number
  courier_name: string
  amount: number
  created_at: string
}

export interface CancelRequestItem {
  id: number
  order_code: string
  courier_name: string
  requested_at: string
}

export interface DeliveryItem {
  id: number
  order_code: string
  customer_name: string
  address: string
  payment_type: PaymentType
  grand_total: number
  delivery_status: DeliveryStatus
  cancel_request: boolean
  assigned_at: string
}

/** One delivered order in the courier's cash / earning report. */
export interface LedgerItem {
  id: number
  order_code: string
  payment_type: PaymentType
  amount: number
  created_at: string
}

export interface CourierSettings {
  payment_type: PaymentKind
  salary: number
  commission: number
  mail_notification: boolean
  otp_notification: boolean
  pickup_latitude: string
  pickup_longitude: string
}

export interface LookupOption {
  id: number
  name: string
  parent_id: number | null
}
export interface CourierLookups {
  countries: LookupOption[]
  states: LookupOption[]
  cities: LookupOption[]
}

/** Every list screen of the module: the kind picks endpoint, row type and i18n keys. */
export interface ListItemMap {
  couriers: CourierItem
  payments: SettlementItem
  collections: SettlementItem
  cancelRequests: CancelRequestItem
  deliveries: DeliveryItem
  cash: LedgerItem
  earnings: LedgerItem
}
export type CourierListKind = keyof ListItemMap
