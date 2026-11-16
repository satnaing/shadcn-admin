import type {
  AffiliateLogItem,
  AffiliateOptions,
  AffiliatePayment,
  AffiliateSettings,
  AffiliateUserDetail,
  FormElement,
  ReferralItem,
  VerificationEntry,
  WithdrawItem,
} from '@/features/affiliate/data/affiliate.type'

const DAY = 86_400_000
const ago = (days: number, hour = 12) =>
  new Date(Date.now() - days * DAY + (hour - 12) * 3_600_000).toISOString()

const NAMES = [
  'Elvin Qasımov',
  'Nərgiz Məmmədli',
  'Rauf Əliyev',
  'Leyla Həsənova',
  'Tural Abbasov',
  'Səbinə Rzayeva',
  'Kamran Mirzəyev',
  'Aysel Quliyeva',
  'Orxan Babayev',
  'Günel İsmayılova',
  'Murad Sadıqov',
  'Ülviyyə Nağıyeva',
  'Fərid Hüseynov',
  'Lalə Məmmədova',
]
const ascii = (s: string) =>
  s
    .toLowerCase()
    .replace(/ə/g, 'e')
    .replace(/ı/g, 'i')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
const email = (name: string) => `${ascii(name).replace(/ /g, '.')}@mail.az`

export const seedSettings: AffiliateSettings = {
  minimum_withdraw_amount: 20,
  validation_days: 30,
}

export const seedCategories = [
  'Electronics',
  'Fashion',
  'Home & Garden',
  'Beauty',
  'Sports',
  'Toys',
  'Books',
  'Grocery',
]

export const seedOptions = (): AffiliateOptions => ({
  user_registration_first_purchase: { status: true, percentage: 5 },
  product_sharing: {
    status: false,
    commission: 10,
    commission_type: 'percent',
  },
  category_wise_affiliate: {
    status: true,
    items: seedCategories.map((category_name, i) => ({
      category_id: i + 1,
      category_name,
      commission: [8, 12, 6, 15, 7, 5, 4, 3][i],
      commission_type: i % 3 === 2 ? 'amount' : 'percent',
    })),
  },
})

export const seedForm: FormElement[] = [
  { type: 'text', label: 'Website or social media link', options: [] },
  {
    type: 'select',
    label: 'Main channel',
    options: ['Instagram', 'YouTube', 'Blog', 'Telegram'],
  },
  {
    type: 'multi_select',
    label: 'Topics',
    options: ['Tech', 'Fashion', 'Home', 'Beauty'],
  },
  { type: 'file', label: 'ID document', options: [] },
]

const verification = (i: number): VerificationEntry[] => [
  {
    type: 'text',
    label: 'Website or social media link',
    value: `https://instagram.com/${email(NAMES[i]).split('@')[0]}`,
  },
  {
    type: 'select',
    label: 'Main channel',
    value: ['Instagram', 'YouTube', 'Blog', 'Telegram'][i % 4],
  },
  {
    type: 'multi_select',
    label: 'Topics',
    value: ['Tech', 'Fashion', 'Home', 'Beauty'].slice(0, 1 + (i % 3)),
  },
  {
    type: 'file',
    label: 'ID document',
    value: `https://picsum.photos/seed/aff-id${i}/640/400`,
  },
]

/** `has_verification` false = the request was rejected (AEC clears the submitted form). */
export const seedUsers: AffiliateUserDetail[] = NAMES.map((name, i) => {
  const approved = i < 9
  const hasInfo = i !== 11
  return {
    id: i + 1,
    name,
    email: email(name),
    phone: `+99450${String(2_000_000 + i * 137_311).slice(0, 7)}`,
    is_approved: approved,
    has_verification: hasInfo,
    balance: approved ? [140.5, 0, 75, 310.25, 12, 58.8, 0, 205, 33.4][i] : 0,
    created_at: ago(120 - i * 7),
    address: `${10 + i} Nizami str., Baku`,
    paypal_email: i % 2 === 0 ? `pay.${email(name)}` : '',
    bank_information:
      i % 2 === 1 ? `Kapital Bank · AZ21AIIB0000000000${3000 + i}` : '',
    verification: hasInfo ? verification(i) : [],
  }
})

export const seedPayments: Array<AffiliatePayment & { user_id: number }> =
  Array.from({ length: 16 }, (_, i) => ({
    id: i + 1,
    user_id: (i % 8) + 1,
    amount: 20 + ((i * 29) % 160) + 0.5,
    payment_method: i % 3 === 0 ? 'Paypal' : 'Bank',
    created_at: ago(2 + i * 4),
  }))

export const seedReferrals: ReferralItem[] = Array.from(
  { length: 18 },
  (_, i) => {
    const name = [
      'Aydın Rəhimov',
      'Sevda Əhmədova',
      'Cavid Nəsirov',
      'Xəyalə Kərimova',
      'Vüsal Əsgərov',
      'Nərmin Qədirova',
    ][i % 6]
    return {
      id: 100 + i,
      name: `${name} ${i > 5 ? i : ''}`.trim(),
      email: `ref${i}.${email(name)}`,
      phone: `+99455${String(1_000_000 + i * 91_113).slice(0, 7)}`,
      referred_by_name: i % 7 === 6 ? null : NAMES[i % 9],
    }
  }
)

export const seedWithdraws: WithdrawItem[] = Array.from(
  { length: 14 },
  (_, i) => {
    const user = seedUsers[i % 9]
    const status = (['pending', 'approved', 'rejected'] as const)[
      i % 3 === 0 ? 0 : i % 3 === 1 ? 1 : 2
    ]
    return {
      id: i + 1,
      affiliate_user_id: user.id,
      name: user.name,
      email: user.email,
      amount: 25 + ((i * 23) % 150),
      status: i === 13 ? 'pending' : status,
      paypal_email: user.paypal_email,
      bank_information: user.bank_information,
      requested_at: ago(1 + i * 3, 10 + (i % 6)),
    }
  }
)

const TYPES = [
  'user_registration_first_purchase',
  'product_sharing',
  'category_wise_affiliate',
] as const
const PRODUCTS = [
  'Wireless headphones Pro',
  'Cotton summer dress',
  'Running shoes Air',
  'Smart watch S3',
  'Kitchen blender 900W',
  'Gaming mouse RGB',
]

export const seedLogs: AffiliateLogItem[] = Array.from(
  { length: 26 },
  (_, i) => {
    const type = TYPES[i % 3]
    const guest = i % 5 === 4
    return {
      id: i + 1,
      referred_by_name: NAMES[i % 9],
      referral_name: guest
        ? null
        : seedReferrals[i % seedReferrals.length].name,
      guest_id: guest ? `G${48210 + i}` : null,
      amount: 3 + ((i * 7) % 40) + 0.25,
      order_code: `20261${String(120 + i * 4).padStart(4, '0')}`,
      affiliate_type: type,
      product_name:
        type === 'user_registration_first_purchase'
          ? null
          : PRODUCTS[i % PRODUCTS.length],
      created_at: ago(i, 8 + (i % 10)),
    }
  }
)
