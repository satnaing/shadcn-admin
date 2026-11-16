import type {
  CustomerLookup,
  ManualMethod,
  OfflineOrder,
  PackageRequest,
  PayoutMethod,
  PayriffSettings,
  WalletRequest,
} from '@/features/payments/data/payments.type'

const pic = (seed: string, w = 64, h = 64) => `https://picsum.photos/seed/${seed}/${w}/${h}`
const day = (n: number) => new Date(Date.UTC(2026, 10, 16 - n, 9, n * 7 % 60)).toISOString()

const NAMES = [
  'Aysel Mammadova', 'Rashad Aliyev', 'Leyla Hasanova', 'Elvin Guliyev', 'Nigar Ismayilova', 'Orkhan Huseynov',
  'Sevinj Karimova', 'Tural Abbasov', 'Gunel Rzayeva', 'Kamran Mustafayev', 'Aygun Jafarova', 'Vugar Nasirov',
]

export const seedCustomers: CustomerLookup[] = NAMES.map((name, i) => ({
  id: i + 1,
  name,
  email: `${name.split(' ')[0].toLowerCase()}@example.az`,
}))

export const seedManual: ManualMethod[] = [
  {
    id: 1, type: 'bank_payment', heading: 'Bank transfer', photo: pic('bank1', 438, 235),
    description: 'Transfer the order total and send the receipt.',
    bank_info: [
      { bank_name: 'Kapital Bank', account_name: 'Xshop LLC', account_number: 'AZ21NABZ00000000137010001944', routing_number: 'NABZAZ2X' },
      { bank_name: 'PASHA Bank', account_name: 'Xshop LLC', account_number: 'AZ77PAHA00000000000000000211', routing_number: 'PAHAAZ22' },
    ],
  },
  { id: 2, type: 'custom_payment', heading: 'Birbank P2P', photo: pic('birbank', 438, 235), description: 'Send to +994 50 000 00 00 and write the order code.', bank_info: [] },
  { id: 3, type: 'check_payment', heading: 'Cheque on delivery', photo: pic('cheque', 438, 235), description: 'The courier collects a company cheque.', bank_info: [] },
  { id: 4, type: 'custom_payment', heading: 'Cash at pickup point', photo: null, description: 'Pay in cash when you collect the parcel.', bank_info: [] },
  {
    id: 5, type: 'bank_payment', heading: 'Corporate account', photo: pic('corp', 438, 235), description: 'For business customers.',
    bank_info: [{ bank_name: 'ABB', account_name: 'Xshop LLC', account_number: 'AZ39IBAZ38010019441234567890', routing_number: '' }],
  },
  { id: 6, type: 'custom_payment', heading: 'Terminal at office', photo: null, description: 'Card payment at our office terminal.', bank_info: [] },
]

const METHODS = ['Bank transfer', 'Birbank P2P', 'Cheque on delivery', 'Corporate account']
const STATUSES: OfflineOrder['payment_status'][] = ['submitted', 'paid', 'unpaid', 'submitted', 'paid']

export const seedOrders: OfflineOrder[] = Array.from({ length: 24 }, (_, i) => ({
  id: i + 1,
  code: `20261116-${String(1000 + i * 37).padStart(6, '0')}`,
  customer: NAMES[i % NAMES.length],
  method: METHODS[i % METHODS.length],
  amount: 35 + ((i * 53) % 400) + 0.5,
  trx_id: `TRX${700100 + i * 13}`,
  receipt: i % 5 === 4 ? null : pic(`receipt${i}`, 480, 640),
  payment_status: STATUSES[i % STATUSES.length],
  created_at: day(i % 14),
}))

export const seedWallet: WalletRequest[] = Array.from({ length: 22 }, (_, i) => {
  const byAdmin = i % 4 === 0
  return {
    id: i + 1,
    customer: NAMES[(i * 5) % NAMES.length],
    amount: 20 + ((i * 29) % 280),
    method: byAdmin ? null : METHODS[i % 3],
    trx_id: `WL${880200 + i * 17}`,
    receipt: i % 6 === 5 ? null : pic(`wallet${i}`, 480, 640),
    approved: byAdmin || i % 3 === 0,
    added_by: byAdmin ? 'admin' : 'customer',
    created_at: day(i % 12),
  }
})

const SELLER_PACKAGES = ['Starter', 'Business', 'Premium']
const CUSTOMER_PACKAGES = ['10 uploads', '50 uploads', 'Unlimited']

const packageRows = (names: string[], seed: string, count: number): PackageRequest[] =>
  Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    customer: NAMES[(i * 3 + 1) % NAMES.length],
    package: i === 4 ? null : names[i % names.length],
    method: METHODS[i % METHODS.length],
    trx_id: `PK${550300 + i * 11}`,
    receipt: i % 5 === 3 ? null : pic(`${seed}${i}`, 480, 640),
    approved: i % 3 === 0,
    created_at: day(i % 10),
  }))

export const seedSellerPackages = packageRows(SELLER_PACKAGES, 'sp', 12)
export const seedCustomerPackages = packageRows(CUSTOMER_PACKAGES, 'cp', 9)

const PAYOUTS: [string, PayoutMethod['type']][] = [
  ['Kapital Bank', 'bank_payment'], ['PASHA Bank', 'bank_payment'], ['ABB', 'bank_payment'], ['Birbank', 'others'],
  ['M10', 'others'], ['Millikart', 'others'], ['Leobank', 'bank_payment'], ['PayPal', 'others'],
]

export const seedPayouts: PayoutMethod[] = PAYOUTS.map(([name, type], i) => ({
  id: i + 1,
  type,
  name,
  logo: pic(`payout${i}`, 96, 96),
  created_at: day(i),
}))

/** Secrets are stored unmasked here; the route masks them on the way out (API contract). */
export const seedPayriff: PayriffSettings = {
  active: true,
  display_name: 'Bank card',
  mode: 'test',
  test_merchant_id: 'ES109000',
  test_secret_key: 'dev-secret-key-1',
  production_merchant_id: '',
  production_secret_key: '',
}
