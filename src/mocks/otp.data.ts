import type { GatewayItem, OtpSettings, Recipient, TemplateItem } from '@/features/otp/data/otp.type'

export const seedSettings: OtpSettings = {
  login_with_otp: true,
  guest_checkout_with_otp: false,
  cod_wallet_otp: true,
}

/** Credentials are stored unmasked here; the route masks secrets on the way out (API contract). */
export const seedGateways: GatewayItem[] = [
  { key: 'twilio', active: false, credentials: { sid: '', auth_token: '', number: '', channel: 'sms' } },
  { key: 'nexmo', active: false, credentials: { key: 'nx-9f3a', secret: 'nexmo-secret-1', sender_id: 'XSHOP' } },
  {
    key: 'fast2sms',
    active: true,
    credentials: { auth_key: 'f2s-live-key-77', entity_id: '', route: 'dlt_manual', language: 'unicode', sender_id: 'XSHOPS' },
  },
  { key: 'mimo', active: false, credentials: { username: '', password: '', sender_id: '' } },
  { key: 'mimsms', active: false, credentials: { user_name: '', api_key: '', sender_id: '' } },
  { key: 'msegat', active: false, credentials: { api_key: '', username: '', user_sender: '' } },
  { key: 'sparrow', active: false, credentials: { token: '', message_from: '' } },
  { key: 'ssl_wireless', active: false, credentials: { api_token: '', sid: '', url: '' } },
  {
    key: 'zender',
    active: false,
    credentials: { site_url: 'https://zender.example.com', api_key: 'zd-key', service: 'sms', whatsapp: '', device: '', gateway: '', sim: '1' },
  },
]

// Bodies are the AEC seed rows (`sql/1.5.sql` and later); ids 1–3 are the always-sent ones.
export const seedTemplates: TemplateItem[] = [
  { id: 1, identifier: 'phone_number_verification', body: '[[code]] is your verification code for [[site_name]].', template_id: null, active: true, required: true },
  { id: 2, identifier: 'password_reset', body: 'Your password reset code is [[code]].', template_id: null, active: true, required: true },
  { id: 3, identifier: 'order_placement', body: 'Your order has been placed and Order Code is [[order_code]]', template_id: null, active: true, required: false },
  { id: 4, identifier: 'delivery_status_change', body: 'Your delivery status has been updated to [[delivery_status]] for Order code : [[order_code]]', template_id: null, active: true, required: false },
  { id: 5, identifier: 'payment_status_change', body: 'Your payment status has been updated to [[payment_status]] for Order code : [[order_code]]', template_id: '1007234', active: true, required: false },
  { id: 6, identifier: 'assign_delivery_boy', body: 'You are assigned to deliver an order. Order code : [[order_code]]', template_id: null, active: false, required: false },
  { id: 7, identifier: 'account_opening', body: 'Hi! An account has been created on [[site_name]]. Your account type is: [[user_type]], password is: [[password]] and the verification code is [[code]] .', template_id: null, active: true, required: true },
  { id: 8, identifier: 'login_with_otp', body: 'Your otp verification code is [[code]]', template_id: null, active: true, required: false },
  { id: 9, identifier: 'guest_checkout_with_otp', body: 'Your otp verification code is [[code]]', template_id: null, active: false, required: false },
  { id: 10, identifier: 'cod_and_wallet_payment_with_otp', body: 'Your otp verification code is [[code]]', template_id: null, active: true, required: false },
]

const names = [
  'Aysel Hüseynova', 'Rauf Məmmədov', 'Nigar Əliyeva', 'Elvin Quliyev', 'Leyla Əsgərova', 'Tural Babayev',
  'Səbinə İsmayılova', 'Kamran Rzayev', 'Günel Hacıyeva', 'Orxan Nəbiyev', 'Aynur Səfərova', 'Murad Cəfərov',
  'Fidan Qasımova', 'Ramin Əhmədov', 'Zəhra Vəliyeva', 'Samir Hüseynli', 'Nərmin Abdullayeva', 'Cavid Mustafayev',
  'Lalə Kərimova', 'Emil Süleymanov', 'Türkan Bağırova', 'Vüsal Ələsgərov', 'Mehriban Tağıyeva', 'Anar Şirinov',
]

export const seedRecipients: Recipient[] = names.map((name, i) => ({
  id: i + 1,
  name,
  phone: `+99450${String(1000000 + i * 37171).slice(0, 7)}`,
}))
