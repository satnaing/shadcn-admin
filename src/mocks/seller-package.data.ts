import type {
  Locale,
  SellerPackage,
} from '@/features/seller-package/data/seller-package.type'

/** Self-contained placeholder picture (no network): a coloured tile with the first letter. */
const tile = (letter: string, hue: number) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='96' height='96'><rect width='96' height='96' fill='hsl(${hue} 55% 60%)'/><text x='48' y='62' font-size='44' text-anchor='middle' fill='white' font-family='sans-serif'>${letter}</text></svg>`
  )}`

type Names = [az: string, en: string, tr: string, ru: string]
type Core = Pick<
  SellerPackage,
  | 'amount'
  | 'duration'
  | 'product_upload_limit'
  | 'preorder_product_upload_limit'
  | 'sellers_count'
> &
  Partial<SellerPackage>

const pack = (
  id: number,
  names: Names,
  hue: number,
  core: Core
): SellerPackage => ({
  id,
  name: names[0],
  translations: Object.fromEntries(
    (['az', 'en', 'tr', 'ru'] as Locale[]).map((l, i) => [l, names[i]])
  ) as Record<Locale, string>,
  logo: tile(names[1][0], hue),
  support_priority: 'normal',
  digital_product_limit: 0,
  staff_limit: 0,
  storage_mb: 100,
  flash_deal_limit: 0,
  coupon_limit: 0,
  promo_product_limit: 0,
  featured_slots: 0,
  monthly_order_limit: -1,
  wholesale_enabled: false,
  shop_design_enabled: false,
  pos_enabled: false,
  custom_domain_enabled: false,
  ...core,
})

export const seedPackages: SellerPackage[] = [
  pack(1, ['Pulsuz', 'Free', 'Ücretsiz', 'Бесплатный'], 200, {
    amount: 0,
    duration: 30,
    product_upload_limit: 5,
    preorder_product_upload_limit: 0,
    sellers_count: 41,
    storage_mb: 50,
    monthly_order_limit: 20,
  }),
  pack(2, ['Başlanğıc', 'Starter', 'Başlangıç', 'Старт'], 30, {
    amount: 19,
    duration: 30,
    product_upload_limit: 50,
    preorder_product_upload_limit: 5,
    sellers_count: 18,
    staff_limit: 1,
    storage_mb: 500,
    coupon_limit: 3,
  }),
  pack(3, ['Biznes', 'Business', 'İş', 'Бизнес'], 140, {
    amount: 49,
    duration: 90,
    product_upload_limit: 300,
    preorder_product_upload_limit: 30,
    sellers_count: 9,
    staff_limit: 5,
    storage_mb: 2000,
    digital_product_limit: 20,
    flash_deal_limit: 4,
    coupon_limit: 20,
    promo_product_limit: 30,
    featured_slots: 3,
    wholesale_enabled: true,
    shop_design_enabled: true,
    support_priority: 'high',
  }),
  pack(4, ['Premium', 'Premium', 'Premium', 'Премиум'], 280, {
    amount: 129,
    duration: 365,
    product_upload_limit: 5000,
    preorder_product_upload_limit: 500,
    sellers_count: 3,
    staff_limit: -1,
    storage_mb: -1,
    digital_product_limit: -1,
    flash_deal_limit: -1,
    coupon_limit: -1,
    promo_product_limit: -1,
    featured_slots: 10,
    wholesale_enabled: true,
    shop_design_enabled: true,
    pos_enabled: true,
    custom_domain_enabled: true,
    support_priority: 'high',
  }),
]
