import type { AddressFormValues } from '@/features/pos/data/pos.schema'
import type {
  PosOrderPayload,
  PosProductItem,
  PosSettings,
  PosStockItem,
} from '@/features/pos/data/pos.type'
import {
  seedAddresses,
  seedCustomers,
  seedLookups,
  seedOrders,
  seedProducts,
  seedSettings,
  seedStocks,
} from './pos.data'
import { createCollection, type Handler, paginate, type Query } from './helpers'

const products = createCollection(seedProducts)
const stocks = createCollection(seedStocks)
const addresses = createCollection(seedAddresses)
const orders = createCollection(seedOrders)
let settings: PosSettings = { ...seedSettings }

const P = '/admin/pos'
const body = <T>(b: unknown) => (b ?? {}) as T
const round2 = (n: number) => Math.round(n * 100) / 100
const rows = <T extends object>(fn: () => T[]) =>
  (() => fn().map((r) => ({ ...r }))) as unknown as () => Record<string, unknown>[]
/** `q` is matched on specific columns below, so the generic any-column search is switched off. */
const withoutQ = (ctx: { params: string[]; query: Query }) => ({
  ...ctx,
  query: { ...ctx.query, q: '' },
})

const categoryName = (id: number) => seedLookups.categories.find((c) => c.id === id)?.name ?? ''
const sellerName = (id: number | null) =>
  id === null ? 'Inhouse' : (seedLookups.sellers.find((s) => s.id === id)?.name ?? '')

/** A category filter also matches its sub-categories (AEC `CategoryUtility::children_ids`). */
function categoryIds(id: number): number[] {
  const list = seedLookups.categories
  const start = list.findIndex((c) => c.id === id)
  if (start < 0) return []
  const depth = list[start].depth
  const ids = [id]
  for (let i = start + 1; i < list.length && list[i].depth > depth; i++) ids.push(list[i].id)
  return ids
}

const matches = (q: string, name: string, barcode: string) =>
  !q || name.toLowerCase().includes(q.toLowerCase()) || barcode === q

function stockRows(query: Query): PosStockItem[] {
  const cats = query.category ? categoryIds(Number(query.category)) : null
  return stocks
    .all()
    .flatMap((s) => {
      const p = products.get(s.product_id)
      if (!p?.pos || (cats && !cats.includes(p.category_id))) return []
      if (query.brand && String(p.brand_id) !== query.brand) return []
      // AEC OR-ed the barcode into the whole WHERE: a barcode search leaked unpublished and foreign products.
      if (!matches(query.q ?? '', p.name, p.barcode)) return []
      return [
        {
          id: s.id,
          product_id: p.id,
          name: p.name,
          variant: s.variant,
          price: p.unit_price,
          tax: round2((p.unit_price * p.tax_percent) / 100),
          stock_qty: s.qty,
          min_qty: p.min_qty,
          digital: p.digital,
          barcode: p.barcode,
          category_id: p.category_id,
          brand_id: p.brand_id,
          image: null,
        },
      ]
    })
    .sort((a, b) => b.product_id - a.product_id)
}

function productRows(query: Query, inPos: boolean): PosProductItem[] {
  const cats = query.category ? categoryIds(Number(query.category)) : null
  return products
    .all()
    .filter((p) => p.pos === inPos)
    .filter((p) => !cats || cats.includes(p.category_id))
    .filter((p) =>
      !query.seller
        ? true
        : query.seller === 'inhouse'
          ? p.seller_id === null
          : String(p.seller_id) === query.seller
    )
    .filter((p) => matches(query.q ?? '', p.name, p.barcode))
    .map((p) => ({
      id: p.id,
      name: p.name,
      category_id: p.category_id,
      category: categoryName(p.category_id),
      seller_id: p.seller_id,
      seller: sellerName(p.seller_id),
      unit_price: p.unit_price,
      stock_qty: stocks
        .all()
        .filter((s) => s.product_id === p.id)
        .reduce((n, s) => n + s.qty, 0),
      rating: p.rating,
    }))
}

/** The client validates the cart; the mock just applies it. */
function placeOrder(order: PosOrderPayload) {
  const lines = order.items.flatMap((i) => {
    const s = stocks.get(i.stock_id)
    const p = s && products.get(s.product_id)
    return s && p ? [{ s, p, quantity: i.quantity }] : []
  })
  const subtotal = lines.reduce((n, l) => n + l.p.unit_price * l.quantity, 0)
  const tax = lines.reduce((n, l) => n + ((l.p.unit_price * l.p.tax_percent) / 100) * l.quantity, 0)
  const gross = subtotal + tax + order.shipping_cost
  const grand_total = round2(gross - Math.min(Math.max(order.discount, 0), gross))

  for (const l of lines) {
    if (!l.p.digital) stocks.update(l.s.id, { qty: Math.max(0, l.s.qty - l.quantity) })
  }

  const customer = seedCustomers.find((c) => c.id === order.customer_id)
  const row = orders.create(
    {
      code: `${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${String(Date.now()).slice(-6)}`,
      date: new Date().toISOString(),
      customer: customer?.name ?? order.guest?.name ?? 'Guest',
      source: order.order_source,
      items_count: lines.length,
      grand_total,
      payment_type: order.payment_type,
      payment_status: order.payment_type === 'cash_on_delivery' ? 'unpaid' : 'paid',
      operator: 'Admin',
    },
    'start'
  )
  return { data: { id: row.id, code: row.code, grand_total } }
}

const routes: Record<string, Handler> = {
  [`GET ${P}/stock`]: (ctx) =>
    paginate(rows(() => stockRows(ctx.query)))({
      ...withoutQ(ctx),
      query: { ...ctx.query, q: '', per_page: ctx.query.per_page ?? '16' },
    }),
  [`GET ${P}/products`]: (ctx) =>
    paginate(rows(() => productRows(ctx.query, true)))(withoutQ(ctx)),
  [`GET ${P}/products/available`]: (ctx) =>
    paginate(rows(() => productRows(ctx.query, false)))(withoutQ(ctx)),
  [`PUT ${P}/products`]: ({ body: b }) => {
    const { ids, pos } = body<{ ids: number[]; pos: boolean }>(b)
    for (const id of ids) products.update(id, { pos })
    return { message: 'ok', data: { updated: ids.length } }
  },

  [`GET ${P}/customers`]: ({ query }) => {
    const field = query.field === 'email' ? 'email' : 'phone'
    const q = (query.q ?? '').toLowerCase()
    const found = seedCustomers.filter((c) => c[field].toLowerCase().includes(q))
    return { data: q.length < 3 ? [] : found.slice(0, 8) }
  },
  [`GET ${P}/customers/:id/addresses`]: ({ params }) => ({
    data: addresses
      .all()
      .filter((a) => String(a.customer_id) === params[0])
      .map(({ customer_id: _c, ...a }) => a),
  }),
  [`POST ${P}/customers/:id/addresses`]: ({ params, body: b }) => {
    const v = body<AddressFormValues>(b)
    const name = (list: { id: number; name: string }[], id: number) =>
      list.find((o) => o.id === id)?.name ?? ''
    const { customer_id: _c, ...row } = addresses.create({
      customer_id: Number(params[0]),
      address: v.address,
      country: name(seedLookups.countries, v.country_id),
      state: name(seedLookups.states, v.state_id),
      city: name(seedLookups.cities, v.city_id),
      postal_code: v.postal_code,
      phone: v.phone,
    })
    return { data: row }
  },

  [`GET ${P}/orders`]: (ctx) =>
    paginate(
      rows(() => orders.all().filter((o) => !ctx.query.tab || o.payment_status === ctx.query.tab))
    )(ctx),
  [`POST ${P}/orders`]: ({ body: b }) => placeOrder(body<PosOrderPayload>(b)),
  [`GET ${P}/orders/:id/receipt`]: ({ params }) => {
    const o = orders.get(params[0])
    const text = `POS receipt ${o?.code}\nTotal: ${o?.grand_total}\nPaper: ${settings.print_width} mm\n`
    return {
      data: {
        download_url: URL.createObjectURL(new Blob([text], { type: 'text/plain' })),
        filename: `order-${o?.code}.txt`,
      },
    }
  },

  [`GET ${P}/settings`]: () => ({ data: settings }),
  [`PUT ${P}/settings`]: ({ body: b }) => {
    settings = { ...settings, ...body<Partial<PosSettings>>(b) }
    return { message: 'ok' }
  },
  [`GET ${P}/lookups`]: () => ({ data: seedLookups }),
}

export default routes
