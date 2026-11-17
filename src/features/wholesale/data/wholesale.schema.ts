import { z } from 'zod'

const num = z
  .number({ message: 'wholesale:validation.number' })
  .min(0, 'wholesale:validation.min0')
const whole = z
  .number({ message: 'wholesale:validation.number' })
  .int('wholesale:validation.integer')
  .min(0, 'wholesale:validation.min0')
const qty = z
  .number({ message: 'wholesale:validation.number' })
  .int('wholesale:validation.integer')
  .min(1, 'wholesale:validation.min1')

const tierSchema = z.object({
  min_qty: qty,
  max_qty: qty,
  price: z
    .number({ message: 'wholesale:validation.number' })
    .positive('wholesale:validation.positive'),
})

/** AEC rule, tightened: percent ≤ 100, a flat discount must stay below the unit price. */
const discountError = (type: string, amount: number, price: number) =>
  type === 'percent' ? amount > 100 : amount >= price

export const productSchema = z
  .object({
    name: z.string().trim().min(1, 'required').max(255),
    brand_id: z.number().nullable(),
    unit_id: z.number().min(1, 'required'),
    min_qty: qty,
    tags: z.string().max(500),
    barcode: z.string().max(64),
    sku: z.string().max(64),
    thumbnail: z.string(),
    video_provider: z.enum(['none', 'youtube', 'vimeo', 'dailymotion']),
    video_link: z.string(),
    description: z.string(),
    unit_price: z
      .number({ message: 'wholesale:validation.number' })
      .positive('wholesale:validation.positive'),
    current_stock: whole,
    low_stock_quantity: whole,
    stock_visibility: z.enum(['quantity', 'text', 'hidden']),
    tiers: z.array(tierSchema).min(1, 'wholesale:validation.tiersRequired'),
    discount_type: z.enum(['flat', 'percent']),
    discount: num,
    discount_start: z.string(),
    discount_end: z.string(),
    category_ids: z.array(z.number()).min(1, 'wholesale:validation.categories'),
    category_id: z.number().min(1, 'required'),
    shipping_type: z.enum(['free', 'flat']),
    shipping_cost: num,
    est_shipping_days: whole,
    is_quantity_multiplied: z.boolean(),
    cash_on_delivery: z.boolean(),
    is_featured: z.boolean(),
    is_todays_deal: z.boolean(),
    is_published: z.boolean(),
    meta_title: z.string().max(120),
    meta_description: z.string().max(300),
    meta_image: z.string(),
  })
  .superRefine((v, ctx) => {
    const add = (path: (string | number)[], message: string) =>
      ctx.addIssue({ code: 'custom', path, message })
    if (!v.category_ids.includes(v.category_id))
      add(['category_id'], 'wholesale:validation.mainCategory')
    if (
      v.discount > 0 &&
      discountError(v.discount_type, v.discount, v.unit_price)
    )
      add(['discount'], 'wholesale:validation.discount')
    if (v.discount_start && v.discount_end && v.discount_end < v.discount_start)
      add(['discount_end'], 'wholesale:validation.dateRange')
    v.tiers.forEach((tier, i) => {
      if (tier.max_qty < tier.min_qty)
        add(['tiers', i, 'max_qty'], 'wholesale:validation.tierRange')
      const prev = v.tiers[i - 1]
      if (prev && tier.min_qty <= prev.max_qty)
        add(['tiers', i, 'min_qty'], 'wholesale:validation.tierOverlap')
    })
  })
export type ProductFormValues = z.infer<typeof productSchema>

export const productDefaults: ProductFormValues = {
  name: '',
  brand_id: null,
  unit_id: 0,
  min_qty: 1,
  tags: '',
  barcode: '',
  sku: '',
  thumbnail: '',
  video_provider: 'none',
  video_link: '',
  description: '',
  unit_price: 0,
  current_stock: 0,
  low_stock_quantity: 1,
  stock_visibility: 'quantity',
  tiers: [{ min_qty: 5, max_qty: 9, price: 0 }],
  discount_type: 'flat',
  discount: 0,
  discount_start: '',
  discount_end: '',
  category_ids: [],
  category_id: 0,
  shipping_type: 'free',
  shipping_cost: 0,
  est_shipping_days: 0,
  is_quantity_multiplied: false,
  cash_on_delivery: true,
  is_featured: false,
  is_todays_deal: false,
  is_published: true,
  meta_title: '',
  meta_description: '',
  meta_image: '',
}
