import type {
  DisputeInfo,
  Locale,
  ReasonKind,
  RefundDecision,
  RefundDetail,
  RefundSettings,
  RefundStatus,
} from '@/features/refund/data/refund.type'

export type RefundRow = RefundDetail
export interface ReasonRow {
  id: number
  kind: ReasonKind
  reason: string
  translations: Record<Locale, string>
  is_active: boolean
  created_at: string
}
export interface CategoryRow {
  id: number
  name: string
  parent_id: number | null
  icon: string
  refund_days: number
}

const DAY = 86_400_000
const ago = (days: number, hour = 12) => new Date(Date.now() - days * DAY + (hour - 12) * 3_600_000).toISOString()

const PRODUCTS = [
  'Wireless headphones Pro', 'Cotton summer dress', 'Running shoes Air', 'Smart watch S3', 'Kitchen blender 900W',
  'Leather wallet', 'Gaming mouse RGB', 'Bluetooth speaker Mini', 'Baby stroller Lite', 'Office chair Ergo',
  'Yoga mat 6mm', 'Coffee machine Duo',
]
const CUSTOMERS = ['Aysel Mammadova', 'Rauf Aliyev', 'Leyla Hasanova', 'Elvin Quliyev', 'Nigar Ismayilova', 'Tural Abbasov', 'Sevinc Rzayeva', 'Kamran Mirzayev']
const SELLERS: Array<[string, 'admin' | 'seller']> = [['xShop', 'admin'], ['Baku Electronics', 'seller'], ['Moda House', 'seller'], ['Sport Zone', 'seller']]
const REASONS = ['Product arrived damaged', 'Wrong item delivered', 'Does not match the description', 'Size does not fit', 'Changed my mind']
const REJECTS = ['Return period expired', 'Product shows signs of use', 'Missing original packaging']
const BANKS = ['Kapital Bank', 'ABB', 'Leobank']

const PLAN: Array<{ status: RefundStatus; channel: 'wallet' | 'offline'; dispute?: RefundStatus }> = [
  { status: 'pending', channel: 'wallet' },
  { status: 'approved', channel: 'wallet' },
  { status: 'rejected', channel: 'wallet', dispute: 'pending' },
  { status: 'pending', channel: 'offline' },
  { status: 'approved', channel: 'offline' },
  { status: 'rejected', channel: 'offline', dispute: 'approved' },
  { status: 'pending', channel: 'wallet' },
  { status: 'rejected', channel: 'wallet' },
  { status: 'approved', channel: 'wallet' },
  { status: 'rejected', channel: 'offline', dispute: 'rejected' },
  { status: 'pending', channel: 'offline' },
  { status: 'rejected', channel: 'wallet', dispute: 'pending' },
]

const decisionOf = (status: RefundStatus, adminOwned: boolean): RefundDecision => (adminOwned ? 'na' : status)

const dispute = (i: number, status: RefundStatus): DisputeInfo => ({
  status,
  reason: 'The product really was defective, photos attached.',
  images: [`https://picsum.photos/seed/dispute${i}/320/240`],
  requested_at: ago(2 + (i % 4)),
  decided_at: status === 'pending' ? null : ago(1),
  reject_reason: status === 'rejected' ? REJECTS[i % REJECTS.length] : null,
  transaction_id: status === 'approved' ? `DSP-${1000 + i}` : null,
  receipt: null,
})

export const seedRefunds: RefundRow[] = Array.from({ length: 24 }, (_, n) => {
  const i = n + 1
  const plan = PLAN[n % PLAN.length]
  const [seller_name, seller_type] = SELLERS[n % SELLERS.length]
  const adminOwned = seller_type === 'admin'
  const offline = plan.channel === 'offline'

  return {
    id: i,
    code: `RF-${String(10_000 + i * 7)}`,
    order_code: `20261${String(100 + i * 3).padStart(4, '0')}`,
    product_name: PRODUCTS[n % PRODUCTS.length],
    product_image: `https://picsum.photos/seed/refund${i}/96/96`,
    customer_name: CUSTOMERS[n % CUSTOMERS.length],
    seller_name,
    seller_type,
    amount: 15 + ((i * 17) % 180) + 0.5,
    payment_channel: plan.channel,
    seller_decision: decisionOf(plan.status, adminOwned),
    admin_decision: plan.status === 'pending' ? 'pending' : plan.status,
    status: plan.status,
    requested_at: ago(14 - (n % 12), 9 + (n % 8)),
    dispute_status: plan.dispute ?? null,
    reason: REASONS[n % REASONS.length],
    images: n % 3 === 0 ? [] : [`https://picsum.photos/seed/proof${i}/320/240`],
    payment_info: offline
      ? { method: BANKS[n % BANKS.length], account_name: CUSTOMERS[n % CUSTOMERS.length], account_number: `AZ21NABZ0000000000${1000 + i}`, note: '' }
      : null,
    paid_at: plan.status === 'approved' ? ago(1) : null,
    decided_at: plan.status === 'pending' ? null : ago(1),
    reject_reason: plan.status === 'rejected' ? REJECTS[n % REJECTS.length] : null,
    transaction_id: plan.status === 'approved' && offline ? `TRX-${5000 + i}` : null,
    receipt: null,
    dispute: plan.dispute ? dispute(i, plan.dispute) : null,
  }
})

const T = (az: string, en: string, tr: string, ru: string): Record<Locale, string> => ({ az, en, tr, ru })

const customerReasons = [
  T('Məhsul zədəli çatdırılıb', 'Product arrived damaged', 'Ürün hasarlı geldi', 'Товар доставлен повреждённым'),
  T('Səhv məhsul göndərilib', 'Wrong item delivered', 'Yanlış ürün gönderildi', 'Доставлен не тот товар'),
  T('Təsvirə uyğun deyil', 'Does not match the description', 'Açıklamaya uymuyor', 'Не соответствует описанию'),
  T('Ölçü uyğun gəlmir', 'Size does not fit', 'Beden uymuyor', 'Не подошёл размер'),
  T('Fikrimi dəyişdim', 'Changed my mind', 'Fikrimi değiştirdim', 'Передумал'),
  T('Keyfiyyət gözlədiyim kimi deyil', 'Quality is below expectations', 'Kalite beklentimin altında', 'Качество ниже ожиданий'),
  T('Çatdırılma gecikib', 'Delivery was too late', 'Teslimat geç oldu', 'Доставка запоздала'),
  T('Komplektasiya natamamdır', 'Parts are missing', 'Parçalar eksik', 'Комплектация неполная'),
]
const rejectionReasons = [
  T('Geri qaytarma müddəti bitib', 'Return period expired', 'İade süresi doldu', 'Срок возврата истёк'),
  T('Məhsul istifadə olunub', 'Product shows signs of use', 'Ürün kullanılmış', 'Товар был в использовании'),
  T('Orijinal qablaşdırma yoxdur', 'Missing original packaging', 'Orijinal ambalaj yok', 'Нет оригинальной упаковки'),
  T('Zədə müştəri təqsiri ilədir', 'Damage caused by the customer', 'Hasar müşteriden kaynaklı', 'Повреждение по вине клиента'),
  T('Şəkillər kifayət deyil', 'Photos are not sufficient', 'Fotoğraflar yetersiz', 'Фотографий недостаточно'),
  T('Məhsul geri qaytarılmaz kateqoriyadadır', 'Category is non-refundable', 'Kategori iade edilemez', 'Категория не подлежит возврату'),
]

export const seedReasons: ReasonRow[] = [
  ...customerReasons.map((translations, n): ReasonRow => ({ id: n + 1, kind: 'customer', reason: translations.az, translations, is_active: n !== 6, created_at: ago(40 - n) })),
  ...rejectionReasons.map((translations, n): ReasonRow => ({ id: n + 20, kind: 'rejection', reason: translations.az, translations, is_active: n !== 5, created_at: ago(30 - n) })),
]

const PARENTS = ['Electronics', 'Fashion', 'Home & Garden', 'Sports', 'Baby & Kids', 'Beauty']
const CHILDREN: Array<[string, number]> = [
  ['Phones', 1], ['Laptops', 1], ['Headphones', 1], ['Dresses', 2], ['Shoes', 2], ['Bags', 2], ['Kitchen', 3],
  ['Furniture', 3], ['Fitness', 4], ['Outdoor', 4], ['Strollers', 5], ['Toys', 5], ['Makeup', 6], ['Skincare', 6],
]

export const seedCategories: CategoryRow[] = [
  ...PARENTS.map((name, n): CategoryRow => ({ id: n + 1, name, parent_id: null, icon: `https://picsum.photos/seed/cat${n}/48/48`, refund_days: n === 5 ? 0 : 14 })),
  ...CHILDREN.map(([name, parent_id], n): CategoryRow => ({ id: n + 11, name, parent_id, icon: `https://picsum.photos/seed/sub${n}/48/48`, refund_days: n % 5 === 4 ? 0 : 7 + (n % 3) * 7 })),
]

export const seedSettings: RefundSettings = {
  approval_mode: 'admin_approval',
  refund_type: 'category',
  refund_days: 7,
  dispute_enabled: true,
  dispute_days: 3,
  sticker: '',
}
