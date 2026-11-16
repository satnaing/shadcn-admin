/** The three switches of AEC "OTP System Settings" (`login_with_otp`, `guest_checkout_with_otp`, `admin_controll_cod_and_wallet_payment_with_otp`). */
export interface OtpSettings {
  login_with_otp: boolean
  guest_checkout_with_otp: boolean
  cod_wallet_otp: boolean
}

export const GATEWAY_KEYS = [
  'twilio',
  'nexmo',
  'fast2sms',
  'mimo',
  'mimsms',
  'msegat',
  'sparrow',
  'ssl_wireless',
  'zender',
] as const
export type GatewayKey = (typeof GATEWAY_KEYS)[number]

/** Secret values come back as this mask; sending the mask unchanged keeps the stored secret. */
export const SECRET_MASK = '********'

export interface GatewayItem {
  key: GatewayKey
  /** Only one gateway is active at a time. */
  active: boolean
  credentials: Record<string, string>
}

export interface TemplateItem {
  id: number
  identifier: string
  body: string
  /** Fast2SMS DLT template id. */
  template_id: string | null
  active: boolean
  /** Verification / reset / account messages: always sent, no switch. */
  required: boolean
}

export interface Recipient {
  id: number
  name: string
  phone: string
}

export interface OtpListParams {
  page?: number
  per_page?: number
  sort?: string
  q?: string
}

export interface BulkSmsPayload {
  phones: string[]
  content: string
  template_id: string
}
