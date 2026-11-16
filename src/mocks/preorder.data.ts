import {
  type ProductFormValues,
  productDefaults,
} from '@/features/preorder/data/preorder.schema'
import type {
  ConversationMessage,
  FaqItem,
  LookupOption,
  NotificationTypeItem,
  OrderDetail,
  OrderStep,
  OwnerType,
  PreorderSettings,
  ProductListItem,
  QueryItem,
  ReviewItem,
  StepStatus,
} from '@/features/preorder/data/preorder.type'

const DAY = 86_400_000
export const ago = (days: number) =>
  new Date(Date.now() - days * DAY).toISOString()

export const seedCategories: LookupOption[] = [
  'Electronics',
  'Gaming',
  'Cameras',
  'Audio',
  'Home appliances',
  'Fashion',
  'Sports',
  'Toys',
].map((name, i) => ({ id: i + 1, name }))
export const seedBrands: LookupOption[] = [
  'Sony',
  'DJI',
  'Samsung',
  'Apple',
  'Xiaomi',
  'Nike',
].map((name, i) => ({ id: i + 1, name }))
export const seedNotes: LookupOption[] = [
  'Refund within 7 days of delivery',
  'Shipping starts after the final payment',
  'Cash on delivery for the remaining amount',
  'Item is made to order',
  'Limited quantity',
].map((name, i) => ({ id: i + 1, name }))

const PRODUCTS: Array<[string, number, number]> = [
  ['PlayStation 5 Pro 2TB', 1899, 2],
  ['DJI Mavic 4 Pro Fly More', 3450, 3],
  ['Sony FE 85mm F1.4 GM II', 2999, 3],
  ['Galaxy S27 Ultra 512GB', 2199, 1],
  ['iPhone 18 Pro 256GB', 2799, 1],
  ['Xiaomi 17 Pro Max', 1599, 1],
  ['Nintendo Switch 3', 899, 2],
  ['Sony WH-1000XM7', 649, 4],
  ['AirPods Pro 4', 549, 4],
  ['Dyson Airwrap Next', 799, 5],
  ['Nike Air Max Dn 2', 289, 7],
  ['Xbox Series Z', 1099, 2],
  ['GoPro Hero 15 Black', 699, 3],
  ['LEGO Titanic Collector', 479, 8],
]
export const SELLERS = [
  'xShop',
  'Baku Electronics',
  'Kontakt Home',
  'Music Gallery',
]
export const CUSTOMERS = [
  'Orxan Babayev',
  'Vüsal Həmidov',
  'Eldar Rəhimov',
  'Aysel Mammadova',
  'Rauf Aliyev',
  'Leyla Hasanova',
  'Elvin Quliyev',
  'Nigar Ismayilova',
]

export type ProductRow = ProductListItem & { form: ProductFormValues }

const owner = (n: number): OwnerType => (n % 3 === 0 ? 'seller' : 'admin')

export const seedProducts: ProductRow[] = PRODUCTS.map(
  ([name, price, cat], n) => {
    const i = n + 1
    const prepay = n % 4 !== 3
    const form: ProductFormValues = {
      ...productDefaults,
      name,
      unit_price: price,
      category_id: cat,
      brand_id: (n % seedBrands.length) + 1,
      unit: 'pc',
      weight: 0.5 + (n % 5),
      thumbnail: `https://picsum.photos/seed/preorder${i}/320/320`,
      description: `${name} — available for preorder, ships after the release date.`,
      is_published: n % 5 !== 4,
      is_featured: n % 4 === 0,
      is_show_on_homepage: n % 3 === 1,
      available_date: ago(-(10 + n * 3)).slice(0, 10),
      discount_type: 'percent',
      discount: n % 3 === 0 ? 5 : 0,
      prepayment: { enabled: prepay, type: 'percent', amount: 20 },
      refund: { enabled: n % 2 === 0, show_note: n % 2 === 0, note_id: 1 },
      shipping: {
        ...productDefaults.shipping,
        type: n % 2 ? 'flat' : 'free',
        min_days: 3,
        max_days: 7,
      },
      stock: {
        ...productDefaults.stock,
        enabled: n % 3 !== 2,
        current: 100 - n * 3,
        preorder_quantity: 20 + n,
      },
    }
    return {
      id: i,
      name,
      image: form.thumbnail,
      owner_type: owner(n),
      owner_name: owner(n) === 'seller' ? SELLERS[1 + (n % 3)] : SELLERS[0],
      category_name: seedCategories[cat - 1].name,
      unit_price: price,
      discount_type: form.discount_type,
      discount: form.discount,
      is_prepayment: prepay,
      prepayment_type: 'percent',
      prepayment_amount: 20,
      is_refundable: form.refund.enabled,
      min_qty: 1,
      available_date: form.available_date,
      orders_count: 0,
      is_published: form.is_published,
      is_featured: form.is_featured,
      is_show_on_homepage: form.is_show_on_homepage,
      approval: n % 6 === 5 ? 'pending' : 'approved',
      created_at: ago(40 - n * 2),
      form,
    }
  }
)

/** Orders walk the workflow: stage → which steps are done. Ages are in days so some orders are "delayed". */
const STAGES: Array<{
  steps: Partial<Record<OrderStep, StepStatus>>
  age: number
}> = [
  { steps: { request: 'pending' }, age: 0.2 },
  { steps: { request: 'accepted' }, age: 3 },
  { steps: { request: 'accepted', prepayment: 'pending' }, age: 2 },
  { steps: { request: 'accepted', prepayment: 'accepted' }, age: 4 },
  {
    steps: { request: 'accepted', prepayment: 'accepted', final: 'accepted' },
    age: 9,
  },
  {
    steps: {
      request: 'accepted',
      prepayment: 'accepted',
      final: 'accepted',
      shipping: 'accepted',
    },
    age: 12,
  },
  {
    steps: {
      request: 'accepted',
      prepayment: 'accepted',
      final: 'accepted',
      shipping: 'accepted',
      delivery: 'accepted',
    },
    age: 20,
  },
  {
    steps: {
      request: 'accepted',
      prepayment: 'accepted',
      final: 'accepted',
      shipping: 'accepted',
      delivery: 'accepted',
      refund: 'pending',
    },
    age: 25,
  },
  {
    steps: {
      request: 'accepted',
      prepayment: 'accepted',
      final: 'accepted',
      shipping: 'accepted',
      delivery: 'accepted',
      refund: 'accepted',
    },
    age: 30,
  },
  { steps: { request: 'denied' }, age: 6 },
]
/** Stage per order (index into STAGES), hand-picked so every list/filter has rows and a seller order is in shipping. */
const PLAN = [
  1, 0, 3, 5, 2, 6, 9, 4, 1, 7, 8, 5, 3, 2, 6, 0, 4, 5, 1, 9, 3, 6, 2, 8, 5, 7,
  4, 1,
]
const NONE: Record<OrderStep, StepStatus> = {
  request: 'none',
  prepayment: 'none',
  final: 'none',
  shipping: 'none',
  delivery: 'none',
  refund: 'none',
}
const NO_TIME: Record<OrderStep, string | null> = {
  request: null,
  prepayment: null,
  final: null,
  shipping: null,
  delivery: null,
  refund: null,
}

const ORDER_OFFSET: Record<OrderStep, number> = {
  request: 0,
  prepayment: 1,
  final: 2,
  shipping: 3,
  delivery: 4,
  refund: 5,
}
const NO_NOTES: Record<OrderStep, string> = {
  request: '',
  prepayment: '',
  final: '',
  shipping: '',
  delivery: '',
  refund: '',
}

export type OrderRow = OrderDetail & { product_id: number }

export const seedOrders: OrderRow[] = Array.from({ length: 28 }, (_, n) => {
  const i = n + 1
  const product = seedProducts[n % seedProducts.length]
  const stage = STAGES[PLAN[n]]
  const qty = 1 + (n % 3)
  const subtotal = product.unit_price * qty
  const tax = Math.round(subtotal * 0.18)
  const prepaymentAmount = product.is_prepayment
    ? Math.round(subtotal * 0.2)
    : 0
  const steps = { ...NONE, ...stage.steps }
  const step_at = { ...NO_TIME }
  for (const k of Object.keys(stage.steps) as OrderStep[])
    step_at[k] = ago(Math.max(0.1, stage.age - ORDER_OFFSET[k]))
  const customer = CUSTOMERS[n % CUSTOMERS.length]

  return {
    id: i,
    product_id: product.id,
    code: `20261${String(110 + i * 9).padStart(4, '0')}-${10 + i}`,
    product_name: product.name,
    product_image: product.image,
    customer_name: customer,
    owner_type: product.owner_type,
    owner_name: product.owner_name,
    quantity: qty,
    grand_total: subtotal + tax,
    prepayment_amount: prepaymentAmount,
    is_refundable: product.is_refundable,
    steps,
    is_viewed: stage.age > 1,
    created_at: ago(stage.age + 0.5),
    customer_email: `customer${i}@example.az`,
    customer_phone: `+994 50 ${String(100 + i).padStart(3, '0')} ${String(10 + i)} ${String(20 + i)}`,
    address: `Baku, Nizami str. ${10 + i}, apt. ${i}`,
    unit_price: product.unit_price,
    subtotal,
    tax,
    shipping_cost: 0,
    coupon_discount: 0,
    product_discount: 0,
    is_prepayment: product.is_prepayment,
    request_note: n % 2 ? 'Please confirm the release date.' : '',
    step_notes: { ...NO_NOTES },
    step_at,
    shipping_proof: '',
  }
})

export interface CommissionRow {
  id: number
  order_id: number
  order_code: string
  seller_name: string
  admin_commission: number
  seller_earning: number
  created_at: string
}
export const seedCommissions: CommissionRow[] = seedOrders
  .filter((o) => o.owner_type === 'seller' && o.steps.delivery === 'accepted')
  .map((o, n) => {
    const admin_commission = Math.round(
      ((o.subtotal - o.coupon_discount) * 10) / 100
    )
    return {
      id: n + 1,
      order_id: o.id,
      order_code: o.code,
      seller_name: o.owner_name,
      admin_commission,
      seller_earning: o.grand_total - admin_commission,
      created_at: o.step_at.delivery ?? ago(1),
    }
  })

export type ConversationRow = {
  id: number
  product_id: number
  title: string
  sender_name: string
  receiver_name: string
  messages: ConversationMessage[]
}
const TOPICS = [
  'Release date question',
  'Can I change the colour?',
  'Deposit payment problem',
  'Delivery to the regions',
  'Warranty terms',
  'Bundle with accessories?',
  'Price match request',
  'Pickup instead of delivery',
]
export const seedConversations: ConversationRow[] = TOPICS.map((title, n) => ({
  id: n + 1,
  product_id: (n % seedProducts.length) + 1,
  title,
  sender_name: CUSTOMERS[n % CUSTOMERS.length],
  receiver_name: seedProducts[n % seedProducts.length].owner_name,
  messages: [
    {
      id: 1,
      sender_name: CUSTOMERS[n % CUSTOMERS.length],
      is_admin: false,
      message: `Hello, ${title.toLowerCase()}`,
      created_at: ago(5 - (n % 4)),
    },
    {
      id: 2,
      sender_name: seedProducts[n % seedProducts.length].owner_name,
      is_admin: false,
      message: 'Thank you for your interest, we will confirm shortly.',
      created_at: ago(4 - (n % 4)),
    },
  ],
}))

export type QueryRow = QueryItem
const QUESTIONS = [
  'Is the release date final?',
  'Will there be a discount for early orders?',
  'Is the deposit refundable?',
  'Which colours will be available?',
  'How long does shipping take after release?',
  'Can I add accessories later?',
]
export const seedQueries: QueryRow[] = Array.from({ length: 12 }, (_, n) => ({
  id: n + 1,
  product_name: seedProducts[n % seedProducts.length].name,
  customer_name: CUSTOMERS[n % CUSTOMERS.length],
  question: QUESTIONS[n % QUESTIONS.length],
  reply: n % 3 === 0 ? 'Yes, the date is confirmed by the manufacturer.' : null,
  created_at: ago(8 - (n % 7)),
}))

export type ReviewRow = ReviewItem & { product_id: number; viewed: boolean }
const COMMENTS = [
  'Great product, arrived as promised.',
  'Waited a long time but worth it.',
  'Packaging could be better.',
  'Excellent support from the seller.',
  'Not what I expected.',
]
export const seedReviews: ReviewRow[] = Array.from({ length: 26 }, (_, n) => ({
  id: n + 1,
  product_id: (n % 8) + 1,
  customer_name: CUSTOMERS[n % CUSTOMERS.length],
  rating: 1 + ((n * 3) % 5),
  comment: COMMENTS[n % COMMENTS.length],
  is_published: n % 4 !== 3,
  created_at: ago(20 - n),
  viewed: n < 18,
}))

const faqT = (q: string, a: string) => ({
  az: { question: q, answer: a },
  en: { question: q, answer: a },
  tr: { question: '', answer: '' },
  ru: { question: '', answer: '' },
})
const FAQS: Array<[string, string]> = [
  [
    'What is a preorder?',
    'You reserve a product before its release by paying a deposit.',
  ],
  [
    'How much is the deposit?',
    'The deposit is set per product, usually 20% of the price.',
  ],
  ['When do I pay the rest?', 'After the final order request is accepted.'],
  [
    'Can I cancel?',
    'Before the final order step you can cancel and the deposit rules of the product apply.',
  ],
  ['How is the product delivered?', 'After release, by courier or pickup.'],
  [
    'What if the release is delayed?',
    'You are notified and can cancel for a refund.',
  ],
  [
    'Can sellers offer preorders?',
    'Yes, if the admin allows it in the settings.',
  ],
  [
    'Is cash on delivery available?',
    'Only for the remaining amount and only when the product allows it.',
  ],
]
export const seedFaqs: FaqItem[] = FAQS.map(([q, a], n) => ({
  id: n + 1,
  question: q,
  answer: a,
  translations: faqT(q, a),
  is_active: n !== 6,
}))

const NOTIFS: Array<[NotificationTypeItem['user_type'], string, string]> = [
  [
    'customer',
    'preorder_request_accepted',
    'Your preorder request was accepted',
  ],
  ['customer', 'preorder_request_denied', 'Your preorder request was denied'],
  [
    'customer',
    'preorder_prepayment_reminder_customer',
    'Please pay the deposit for your preorder',
  ],
  [
    'customer',
    'preorder_final_order_reminder_customer',
    'Please confirm your final order',
  ],
  ['customer', 'preorder_product_in_shipping', 'Your preorder is on its way'],
  ['customer', 'preorder_product_delivered', 'Your preorder was delivered'],
  ['seller', 'preorder_request_received', 'A new preorder request arrived'],
  [
    'seller',
    'preorder_prepayment_submitted',
    'The customer submitted a deposit',
  ],
  [
    'seller',
    'preorder_final_order_submitted',
    'The customer submitted the final order',
  ],
  [
    'admin',
    'preorder_request_received_admin',
    'A new preorder request arrived',
  ],
  [
    'admin',
    'preorder_refund_requested',
    'A refund was requested for a preorder',
  ],
  ['admin', 'preorder_delivered_admin', 'A preorder was delivered'],
]
export const seedNotificationTypes: NotificationTypeItem[] = NOTIFS.map(
  ([user_type, type, text], n) => ({
    id: n + 1,
    user_type,
    type,
    name: text.replace(/^Your |^A /, '').replace(/^./, (c) => c.toUpperCase()),
    default_text: text,
    image: `https://picsum.photos/seed/notif${n + 1}/64/64`,
    translations: {
      az: { name: text, default_text: text },
      en: { name: text, default_text: text },
      tr: { name: '', default_text: '' },
      ru: { name: '', default_text: '' },
    },
    is_active: n % 5 !== 4,
  })
)

export const seedSettings: PreorderSettings = {
  allow_seller_products: true,
  seller_commission: 10,
  faq_banner: '',
  flat_shipping_rate: 5,
  request_instruction:
    'Send your preorder request, we will confirm within one business day.',
  payment_qr: '',
  prepayment_instruction:
    'Transfer the deposit to the card below and upload the receipt.',
}
