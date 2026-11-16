import type { ProductFormValues } from '@/features/preorder/data/preorder.schema'
import type {
  DashboardStats,
  FaqItem,
  NotificationTypeItem,
  OrderStep,
  PreorderSettings,
  ProductFlag,
  StepPayload,
} from '@/features/preorder/data/preorder.type'
import { createCollection, type Handler, paginate, type Query } from './helpers'
import {
  type ProductRow,
  type ReviewRow,
  seedBrands,
  seedCategories,
  seedConversations,
  seedFaqs,
  seedNotes,
  seedNotificationTypes,
  seedProducts,
  seedQueries,
  seedReviews,
  seedSettings,
} from './preorder.data'
import {
  applyStep,
  commissions,
  counts,
  delayedFinal,
  delayedPrepayment,
  filterOrders,
  listItem,
  orders,
} from './preorder.orders'

const products = createCollection(seedProducts)
const conversations = createCollection(seedConversations)
const queries = createCollection(seedQueries)
const reviews = createCollection(seedReviews)
const faqs = createCollection(seedFaqs)
const notifications = createCollection(seedNotificationTypes)
let settings: PreorderSettings = { ...seedSettings }

const P = '/admin/preorder'
const body = <T>(b: unknown) => (b ?? {}) as T
const now = () => new Date().toISOString()
// paginate() is typed for loose records; rows are cloned so React Query sees changes after in-place writes
const rows = <T extends object>(fn: () => T[]) =>
  (() => fn().map((r) => ({ ...r }))) as unknown as () => Record<
    string,
    unknown
  >[]
const OK = { message: 'ok' }

const ordersCount = (productId: number) =>
  orders.all().filter((o) => o.product_id === productId).length

const productList = (q: Query) =>
  products
    .all()
    .filter(
      (p) =>
        !q.owner ||
        q.owner === 'all' ||
        p.owner_type === (q.owner === 'inhouse' ? 'admin' : 'seller')
    )
    .filter(
      (p) =>
        !q.state ||
        (q.state === 'published'
          ? p.is_published
          : q.state === 'unpublished'
            ? !p.is_published
            : p.is_featured)
    )
    .map(
      ({ form, ...p }) =>
        ({ ...p, orders_count: ordersCount(p.id) }) as Omit<ProductRow, 'form'>
    )

const toRow = (
  v: ProductFormValues
): Omit<
  ProductRow,
  | 'id'
  | 'created_at'
  | 'owner_type'
  | 'owner_name'
  | 'approval'
  | 'orders_count'
> => ({
  name: v.name,
  image: v.thumbnail,
  category_name:
    seedCategories.find((c) => c.id === v.category_id)?.name ?? '—',
  unit_price: v.unit_price,
  discount_type: v.discount_type,
  discount: v.discount,
  is_prepayment: v.prepayment.enabled,
  prepayment_type: v.prepayment.type,
  prepayment_amount: v.prepayment.amount,
  is_refundable: v.refund.enabled,
  min_qty: v.min_qty,
  available_date: v.available_date,
  is_published: v.is_published,
  is_featured: v.is_featured,
  is_show_on_homepage: v.is_show_on_homepage,
  form: v,
})

const monthSales = (monthOffset = 0) => {
  const d = new Date()
  return orders
    .all()
    .filter((o) => {
      const at = new Date(o.step_at.delivery ?? 0)
      return (
        o.steps.delivery === 'accepted' &&
        o.steps.refund !== 'accepted' &&
        at.getMonth() === (d.getMonth() + monthOffset) % 12 &&
        at.getFullYear() === d.getFullYear()
      )
    })
    .reduce((sum, o) => sum + o.subtotal, 0)
}

const dashboard = (): DashboardStats => {
  const all = orders.all()
  const delivered = all.filter(
    (o) => o.steps.delivery === 'accepted' && o.steps.refund !== 'accepted'
  )
  const sum = (list: typeof all) => list.reduce((s, o) => s + o.grand_total, 0)
  return {
    products_total: products.all().length,
    products_live: products.all().filter((p) => p.is_published).length,
    inhouse_sales: sum(delivered.filter((o) => o.owner_type === 'admin')),
    seller_sales: sum(delivered.filter((o) => o.owner_type === 'seller')),
    month_sales: monthSales(),
    in_shipping: all.filter(
      (o) => o.steps.shipping === 'accepted' && o.steps.delivery === 'none'
    ).length,
    delivered: all.filter((o) => o.steps.delivery === 'accepted').length,
    requests: all.filter((o) => o.steps.request === 'pending').length,
    accepted_requests: all.filter(
      (o) => o.steps.request === 'accepted' && o.steps.prepayment === 'none'
    ).length,
    prepayment_requests: all.filter((o) => o.steps.prepayment === 'pending')
      .length,
    confirmed_prepayments: all.filter(
      (o) => o.steps.prepayment === 'accepted' && o.steps.final === 'none'
    ).length,
    final_preorders: all.filter((o) => o.steps.final === 'accepted').length,
    delayed_prepayment: all.filter(delayedPrepayment).length,
    delayed_final: all.filter(delayedFinal).length,
    monthly_sales: Array.from({ length: 12 }, (_, m) =>
      monthSales(m - new Date().getMonth())
    ),
  }
}

const topProducts = (owner?: string) => {
  const qty = new Map<number, number>()
  for (const o of orders
    .all()
    .filter(
      (x) =>
        x.steps.delivery === 'accepted' &&
        (!owner ||
          owner === 'all' ||
          x.owner_type === (owner === 'inhouse' ? 'admin' : 'seller'))
    )) {
    qty.set(o.product_id, (qty.get(o.product_id) ?? 0) + o.quantity)
  }
  return [...qty]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([id, quantity]) => {
      const p = products.get(id)
      return { id, name: p?.name ?? '', image: p?.image ?? '', quantity }
    })
}

const reviewProducts = (q: Query) =>
  products
    .all()
    .filter(
      (p) =>
        !q.owner ||
        q.owner === 'all' ||
        p.owner_type === (q.owner === 'inhouse' ? 'admin' : 'seller')
    )
    .map((p) => {
      const list = reviews.all().filter((r) => r.product_id === p.id)
      const rating = list.length
        ? Math.round(
            (list.reduce((s, r) => s + r.rating, 0) / list.length) * 10
          ) / 10
        : 0
      return {
        id: p.id,
        product_name: p.name,
        owner_name: p.owner_name,
        rating,
        reviews_count: list.length,
        has_new: list.some((r) => !r.viewed),
      }
    })
    .filter(
      (p) =>
        p.reviews_count > 0 &&
        (!q.rating || Math.floor(p.rating) === Number(q.rating))
    )

const conversationList = () =>
  conversations.all().map(({ messages, product_id, ...c }) => ({
    ...c,
    product_name: products.get(product_id)?.name ?? '',
    last_message_at: messages[messages.length - 1]?.created_at ?? '',
  }))

const faqList = () =>
  faqs
    .all()
    .map((f) => ({
      ...f,
      question: f.translations.az.question,
      answer: f.translations.az.answer,
    }))

const routes: Record<string, Handler> = {
  [`GET ${P}/dashboard`]: () => ({ data: dashboard() }),
  [`GET ${P}/dashboard/top-products`]: ({ query }) => ({
    data: topProducts(query.owner),
  }),
  [`GET ${P}/lookups`]: () => ({
    data: { categories: seedCategories, brands: seedBrands, notes: seedNotes },
  }),

  [`GET ${P}/products`]: (ctx) =>
    paginate(rows(() => productList(ctx.query)))(ctx),
  [`GET ${P}/products/:id`]: ({ params }) => ({
    data: {
      id: Number(params[0]),
      ...(products.get(params[0]) ?? products.all()[0]).form,
    },
  }),
  [`POST ${P}/products`]: ({ body: b }) => {
    const v = body<ProductFormValues>(b)
    return {
      ...OK,
      data: products.create(
        {
          ...toRow(v),
          owner_type: 'admin',
          owner_name: 'xShop',
          approval: 'approved',
          orders_count: 0,
          created_at: now(),
        },
        'start'
      ),
    }
  },
  [`PUT ${P}/products/:id`]: ({ params, body: b }) => {
    products.update(params[0], toRow(body<ProductFormValues>(b)))
    return OK
  },
  [`DELETE ${P}/products/:id`]: ({ params }) => {
    products.remove(params[0])
    return OK
  },
  [`POST ${P}/products/bulk-delete`]: ({ body: b }) => {
    for (const id of body<{ ids: number[] }>(b).ids ?? []) products.remove(id)
    return OK
  },
  [`PATCH ${P}/products/:id/flags`]: ({ params, body: b }) => {
    const { flag, value } = body<{ flag: ProductFlag; value: boolean }>(b)
    const p = products.get(params[0])
    if (!p) return OK
    if (flag === 'approval')
      products.update(p.id, { approval: value ? 'approved' : 'pending' })
    else
      products.update(p.id, {
        [flag]: value,
        form: { ...p.form, [flag]: value },
      })
    return OK
  },

  [`GET ${P}/orders`]: (ctx) =>
    paginate(rows(() => filterOrders(ctx.query).map(listItem)))(ctx),
  [`GET ${P}/orders/counts`]: ({ query }) => ({ data: counts(query.scope) }),
  [`POST ${P}/orders/bulk-delete`]: ({ body: b }) => {
    for (const id of body<{ ids: number[] }>(b).ids ?? []) orders.remove(id)
    return OK
  },
  [`POST ${P}/orders/reminders`]: ({ body: b }) => {
    const { ids, type } = body<{ ids: number[]; type: 'prepayment' | 'final' }>(
      b
    )
    const key =
      type === 'prepayment'
        ? 'preorder_prepayment_reminder_customer'
        : 'preorder_final_order_reminder_customer'
    const active = notifications.all().find((n) => n.type === key)?.is_active
    return {
      message: active ? 'ok' : 'disabled',
      data: { sent: active ? (ids ?? []).length : 0 },
    }
  },
  [`GET ${P}/orders/:id`]: ({ params }) => {
    const o = orders.get(params[0]) ?? orders.all()[0]
    o.is_viewed = true
    return { data: { ...listItem(o) } }
  },
  [`PUT ${P}/orders/:id/steps/:step`]: ({ params, body: b }) => {
    const o = orders.get(params[0])
    const ok =
      !!o &&
      applyStep(
        o,
        params[1] as OrderStep,
        body<StepPayload>(b),
        settings.seller_commission
      )
    return ok ? OK : { message: 'previous_step_required' }
  },
  [`DELETE ${P}/orders/:id`]: ({ params }) => {
    orders.remove(params[0])
    return OK
  },
  [`GET ${P}/orders/:id/invoice`]: ({ params }) => {
    const o = orders.get(params[0])
    const text = `Preorder invoice ${o?.code}\n${o?.product_name} x ${o?.quantity}\nTotal: ${o?.grand_total}\n`
    return {
      data: {
        download_url: URL.createObjectURL(
          new Blob([text], { type: 'text/plain' })
        ),
        filename: `preorder-${o?.code}.txt`,
      },
    }
  },

  [`GET ${P}/commissions`]: (ctx) =>
    paginate(
      rows(() =>
        commissions
          .all()
          .filter(
            (c) =>
              (!ctx.query.from ||
                c.created_at.slice(0, 10) >= ctx.query.from) &&
              (!ctx.query.to || c.created_at.slice(0, 10) <= ctx.query.to)
          )
      )
    )(ctx),

  [`GET ${P}/conversations`]: (ctx) => paginate(rows(conversationList))(ctx),
  [`GET ${P}/conversations/:id`]: ({ params }) => {
    const c = conversations.get(params[0]) ?? conversations.all()[0]
    return {
      data: {
        ...conversationList().find((x) => x.id === c.id),
        messages: c.messages.map((m) => ({ ...m })),
      },
    }
  },
  [`POST ${P}/conversations/:id/reply`]: ({ params, body: b }) => {
    const c = conversations.get(params[0])
    if (c)
      c.messages = [
        ...c.messages,
        {
          id: c.messages.length + 1,
          sender_name: 'Admin',
          is_admin: true,
          message: body<{ message: string }>(b).message,
          created_at: now(),
        },
      ]
    return OK
  },
  [`DELETE ${P}/conversations/:id`]: ({ params }) => {
    conversations.remove(params[0])
    return OK
  },

  [`GET ${P}/queries`]: (ctx) =>
    paginate(
      rows(() =>
        queries
          .all()
          .filter(
            (x) =>
              !ctx.query.state ||
              (ctx.query.state === 'replied' ? x.reply : !x.reply)
          )
      )
    )(ctx),
  [`PUT ${P}/queries/:id`]: ({ params, body: b }) => {
    queries.update(params[0], { reply: body<{ reply: string }>(b).reply })
    return OK
  },

  [`GET ${P}/reviews`]: (ctx) =>
    paginate(rows(() => reviewProducts(ctx.query)))(ctx),
  [`GET ${P}/reviews/products/:id`]: ({ params }) => {
    const list = reviews.all().filter((r) => String(r.product_id) === params[0])
    for (const r of list) r.viewed = true
    return {
      data: {
        product_name: products.get(params[0])?.name ?? '',
        reviews: list.map(({ product_id, viewed, ...r }: ReviewRow) => r),
      },
    }
  },
  [`PATCH ${P}/reviews/:id/status`]: ({ params, body: b }) => {
    reviews.update(params[0], {
      is_published: body<{ is_published: boolean }>(b).is_published,
    })
    return OK
  },

  [`GET ${P}/faqs`]: (ctx) => paginate(rows(faqList))(ctx),
  [`POST ${P}/faqs`]: ({ body: b }) => {
    const { translations } = body<Pick<FaqItem, 'translations'>>(b)
    return {
      ...OK,
      data: faqs.create(
        {
          translations,
          question: translations.az.question,
          answer: translations.az.answer,
          is_active: true,
        },
        'start'
      ),
    }
  },
  [`PUT ${P}/faqs/:id`]: ({ params, body: b }) => {
    const { translations } = body<Pick<FaqItem, 'translations'>>(b)
    faqs.update(params[0], { translations })
    return OK
  },
  [`DELETE ${P}/faqs/:id`]: ({ params }) => {
    faqs.remove(params[0])
    return OK
  },
  [`PATCH ${P}/faqs/:id/status`]: ({ params, body: b }) => {
    faqs.update(params[0], {
      is_active: body<{ is_active: boolean }>(b).is_active,
    })
    return OK
  },

  [`GET ${P}/notification-types`]: (ctx) =>
    paginate(
      rows(() =>
        notifications
          .all()
          .filter(
            (n) => !ctx.query.user_type || n.user_type === ctx.query.user_type
          )
      )
    )(ctx),
  [`PUT ${P}/notification-types/:id`]: ({ params, body: b }) => {
    const v = body<Pick<NotificationTypeItem, 'image' | 'translations'>>(b)
    notifications.update(params[0], {
      ...v,
      name: v.translations.az.name,
      default_text: v.translations.az.default_text,
    })
    return OK
  },
  [`PATCH ${P}/notification-types/:id`]: ({ params, body: b }) => {
    notifications.update(params[0], {
      is_active: body<{ is_active: boolean }>(b).is_active,
    })
    return OK
  },

  [`GET ${P}/settings`]: () => ({ data: settings }),
  [`PUT ${P}/settings`]: ({ body: b }) => {
    settings = { ...settings, ...body<PreorderSettings>(b) }
    return OK
  },
}

export default routes
