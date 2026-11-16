import { z } from 'zod'
import type { FaqItem, PreorderSettings } from './preorder.type'

const num = z
  .number({ message: 'preorder:validation.number' })
  .min(0, 'preorder:validation.min0')
const typeEnum = z.enum(['flat', 'percent'])
const noteId = z.number().nullable()

const prepayment = z.object({
  enabled: z.boolean(),
  type: typeEnum,
  amount: num,
})
const coupon = z.object({
  enabled: z.boolean(),
  code: z.string().trim().max(40),
  type: typeEnum,
  amount: num,
  instructions: z.string(),
})
const advance = z.object({
  enabled: z.boolean(),
  after_type: typeEnum,
  after_amount: num,
  direct_type: typeEnum,
  direct_amount: num,
})
const refund = z.object({
  enabled: z.boolean(),
  show_note: z.boolean(),
  note_id: noteId,
})
const shipping = z.object({
  type: z.enum(['free', 'flat']),
  min_days: num,
  max_days: num,
  show_time: z.boolean(),
  show_note: z.boolean(),
  note_id: noteId,
})
const cod = z.object({
  enabled: z.boolean(),
  prepayment_needed: z.boolean(),
  show_note: z.boolean(),
  note_id: noteId,
})
const stock = z.object({
  enabled: z.boolean(),
  visibility: z.enum(['quantity', 'text', 'hidden']),
  current: num,
  low: num,
  low_warning: z.boolean(),
  custom_order_show: z.boolean(),
  preorder_quantity: num,
  final_quantity: num,
})

/** AEC rule, tightened: percent ≤ 100, flat must stay below the unit price. */
const amountError = (type: string, amount: number, price: number) =>
  type === 'percent' ? amount > 100 : amount >= price

export const productSchema = z
  .object({
    name: z.string().trim().min(1, 'required').max(255),
    category_id: z.number().min(1, 'required'),
    brand_id: z.number().nullable(),
    unit: z.string().trim().min(1, 'required').max(40),
    weight: num,
    min_qty: z
      .number()
      .int('preorder:validation.integer')
      .min(1, 'preorder:validation.min1'),
    barcode: z.string().max(64),
    thumbnail: z.string(),
    video_provider: z.enum(['none', 'youtube', 'vimeo', 'dailymotion']),
    video_link: z.string(),
    description: z.string(),
    unit_price: z
      .number({ message: 'preorder:validation.number' })
      .positive('preorder:validation.positive'),
    discount_type: typeEnum,
    discount: num,
    discount_start: z.string(),
    discount_end: z.string(),
    available_date: z.string(),
    is_published: z.boolean(),
    is_featured: z.boolean(),
    is_show_on_homepage: z.boolean(),
    sample_order: z.boolean(),
    wholesale: z.boolean(),
    show_lead_time: z.boolean(),
    prepayment,
    coupon,
    advance,
    refund,
    shipping,
    cod,
    stock,
    meta_title: z.string().max(120),
    meta_description: z.string().max(300),
    meta_image: z.string(),
  })
  .superRefine((v, ctx) => {
    const add = (path: (string | number)[], message: string) =>
      ctx.addIssue({ code: 'custom', path, message })
    if (
      v.discount > 0 &&
      amountError(v.discount_type, v.discount, v.unit_price)
    )
      add(['discount'], 'preorder:validation.discount')
    if (
      v.coupon.enabled &&
      amountError(v.coupon.type, v.coupon.amount, v.unit_price)
    )
      add(['coupon', 'amount'], 'preorder:validation.discount')
    if (
      v.prepayment.enabled &&
      (v.prepayment.amount <= 0 ||
        amountError(v.prepayment.type, v.prepayment.amount, v.unit_price))
    ) {
      add(['prepayment', 'amount'], 'preorder:validation.prepayment')
    }
    if (v.discount_start && v.discount_end && v.discount_end < v.discount_start)
      add(['discount_end'], 'preorder:validation.dateRange')
    if (v.shipping.min_days > v.shipping.max_days)
      add(['shipping', 'max_days'], 'preorder:validation.daysRange')
    if (v.coupon.enabled && !v.coupon.code.trim())
      add(['coupon', 'code'], 'required')
  })
export type ProductFormValues = z.infer<typeof productSchema>

export const productDefaults: ProductFormValues = {
  name: '',
  category_id: 0,
  brand_id: null,
  unit: 'pc',
  weight: 0,
  min_qty: 1,
  barcode: '',
  thumbnail: '',
  video_provider: 'none',
  video_link: '',
  description: '',
  unit_price: 0,
  discount_type: 'flat',
  discount: 0,
  discount_start: '',
  discount_end: '',
  available_date: '',
  is_published: false,
  is_featured: false,
  is_show_on_homepage: false,
  sample_order: false,
  wholesale: false,
  show_lead_time: false,
  prepayment: { enabled: false, type: 'percent', amount: 20 },
  coupon: {
    enabled: false,
    code: '',
    type: 'percent',
    amount: 0,
    instructions: '',
  },
  advance: {
    enabled: false,
    after_type: 'percent',
    after_amount: 0,
    direct_type: 'percent',
    direct_amount: 0,
  },
  refund: { enabled: false, show_note: false, note_id: null },
  shipping: {
    type: 'free',
    min_days: 0,
    max_days: 0,
    show_time: false,
    show_note: false,
    note_id: null,
  },
  cod: {
    enabled: false,
    prepayment_needed: false,
    show_note: false,
    note_id: null,
  },
  stock: {
    enabled: false,
    visibility: 'quantity',
    current: 0,
    low: 0,
    low_warning: false,
    custom_order_show: false,
    preorder_quantity: 0,
    final_quantity: 0,
  },
  meta_title: '',
  meta_description: '',
  meta_image: '',
}

export const stepSchema = z.object({
  note: z.string().max(500),
  proof: z.string(),
})
export type StepFormValues = z.infer<typeof stepSchema>

export const replySchema = z.object({
  text: z.string().trim().min(1, 'required').max(2000),
})
export type ReplyFormValues = z.infer<typeof replySchema>

const faqText = z.object({
  question: z.string().max(500),
  answer: z.string().max(4000),
})
export const faqSchema = z.object({
  translations: z.object({
    az: faqText.extend({
      question: z.string().trim().min(1, 'required').max(500),
    }),
    en: faqText,
    tr: faqText,
    ru: faqText,
  }),
})
export type FaqFormValues = z.infer<typeof faqSchema>
export const faqToForm = (f?: FaqItem): FaqFormValues => ({
  translations: f?.translations ?? {
    az: { question: '', answer: '' },
    en: { question: '', answer: '' },
    tr: { question: '', answer: '' },
    ru: { question: '', answer: '' },
  },
})

const notifText = z.object({
  name: z.string().trim().max(160),
  default_text: z.string().max(1000),
})
export const notificationSchema = z.object({
  image: z.string(),
  translations: z.object({
    az: notifText.extend({
      name: z.string().trim().min(1, 'required').max(160),
    }),
    en: notifText,
    tr: notifText,
    ru: notifText,
  }),
})
export type NotificationFormValues = z.infer<typeof notificationSchema>

export const settingsSchema = z.object({
  allow_seller_products: z.boolean(),
  seller_commission: z
    .number({ message: 'preorder:validation.number' })
    .min(0, 'preorder:validation.min0')
    .max(100, 'preorder:validation.max100'),
  faq_banner: z.string(),
  flat_shipping_rate: num,
  request_instruction: z.string().max(3000),
  payment_qr: z.string(),
  prepayment_instruction: z.string().max(3000),
}) satisfies z.ZodType<PreorderSettings>
export type SettingsFormValues = z.infer<typeof settingsSchema>
