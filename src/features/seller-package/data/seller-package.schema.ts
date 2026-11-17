import { z } from 'zod'
import { SUPPORT_PRIORITIES, type SellerPackage } from './seller-package.type'

const text = z.string().trim().max(255, 'seller_package:validation.max255')
const num = { message: 'seller_package:validation.number' }
const count = z
  .number(num)
  .int('seller_package:validation.integer')
  .min(0, 'seller_package:validation.min0')
/** -1 means unlimited. */
const limit = z
  .number(num)
  .int('seller_package:validation.integer')
  .min(-1, 'seller_package:validation.minUnlimited')

/** AEC took any text for amount, upload limit and days; all must be real numbers (counts whole). */
export const packageSchema = z.object({
  translations: z.object({
    az: text.min(1, 'required'),
    en: text,
    tr: text,
    ru: text,
  }),
  amount: z.number(num).min(0, 'seller_package:validation.min0'),
  duration: count.min(1, 'seller_package:validation.minDuration'),
  product_upload_limit: count,
  preorder_product_upload_limit: count,
  logo: z.string().min(1, 'required'),
  support_priority: z.enum(SUPPORT_PRIORITIES),
  digital_product_limit: limit,
  staff_limit: limit,
  storage_mb: limit,
  flash_deal_limit: limit,
  coupon_limit: limit,
  promo_product_limit: limit,
  featured_slots: limit,
  monthly_order_limit: limit,
  wholesale_enabled: z.boolean(),
  shop_design_enabled: z.boolean(),
  pos_enabled: z.boolean(),
  custom_domain_enabled: z.boolean(),
})
export type PackageFormValues = z.infer<typeof packageSchema>

export const packageDefaults: PackageFormValues = {
  translations: { az: '', en: '', tr: '', ru: '' },
  amount: 0,
  duration: 30,
  product_upload_limit: 10,
  preorder_product_upload_limit: 0,
  logo: '',
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
}

/** Edit form values: every form key of the package (`id`, `name`, `sellers_count` are not editable). */
export const packageToForm = (p: SellerPackage): PackageFormValues => ({
  ...(Object.fromEntries(
    Object.keys(packageDefaults).map((k) => [k, p[k as keyof SellerPackage]])
  ) as PackageFormValues),
  translations: { ...p.translations },
})
