import type { ProductFormValues } from '@/features/wholesale/data/wholesale.schema'
import type {
  ProductFlag,
  WholesaleLookups,
  WholesaleProduct,
} from '@/features/wholesale/data/wholesale.type'
import { createCollection, type Handler, paginate, type Query } from './helpers'
import {
  OWNERS,
  seedLookups,
  seedProducts,
  type WholesaleRow,
} from './wholesale.data'

const products = createCollection(seedProducts)

const P = '/admin/wholesale'
const body = <T>(b: unknown) => (b ?? {}) as T
const ok = { message: 'ok' }
/** Columns the table may sort by; AEC passed any `?type=column,dir` straight to `orderBy`. */
const SORTABLE = [
  'id',
  'name',
  'num_of_sale',
  'unit_price',
  'rating',
  'created_at',
]

const toListItem = (r: WholesaleRow): WholesaleProduct => ({
  id: r.id,
  name: r.form.name,
  thumbnail: r.form.thumbnail || null,
  owner_type: r.owner_type,
  owner_id: r.owner_id,
  owner_name: r.owner_name,
  num_of_sale: r.num_of_sale,
  unit_price: r.form.unit_price,
  rating: r.rating,
  stock: r.form.current_stock,
  low_stock_quantity: r.form.low_stock_quantity,
  tiers_count: r.form.tiers.length,
  is_published: r.form.is_published,
  is_featured: r.form.is_featured,
  is_todays_deal: r.form.is_todays_deal,
  is_approved: r.is_approved,
  created_at: r.created_at,
})

const listFor = (q: Query) =>
  products
    .all()
    .filter(
      (r) =>
        !q.owner ||
        q.owner === 'all' ||
        r.owner_type === (q.owner === 'inhouse' ? 'admin' : 'seller')
    )
    .filter((r) => !q.seller || String(r.owner_id) === q.seller)
    .map(toListItem)

const flagOf = (r: WholesaleRow, flag: ProductFlag, value: boolean) =>
  flag === 'is_approved'
    ? { is_approved: value }
    : { form: { ...r.form, [flag]: value } }

const routes: Record<string, Handler> = {
  [`GET ${P}/lookups`]: () => ({
    data: {
      ...seedLookups,
      sellers: OWNERS.map(({ id, name }) => ({ id, name })),
    } satisfies WholesaleLookups,
  }),

  [`GET ${P}/products`]: (ctx) => {
    const field = (ctx.query.sort ?? 'id').replace(/^-/, '')
    const query = SORTABLE.includes(field)
      ? ctx.query
      : { ...ctx.query, sort: '-id' }

    return paginate(
      () => listFor(ctx.query) as unknown as Record<string, unknown>[]
    )({ ...ctx, query })
  },
  [`GET ${P}/products/:id`]: ({ params }) => ({
    data: {
      id: Number(params[0]),
      ...(products.get(params[0]) ?? products.all()[0]).form,
    },
  }),
  [`POST ${P}/products`]: ({ body: b }) => ({
    ...ok,
    data: products.create({
      owner_id: OWNERS[0].id,
      owner_type: 'admin',
      owner_name: OWNERS[0].name,
      num_of_sale: 0,
      rating: 0,
      is_approved: true,
      created_at: new Date().toISOString(),
      form: body<ProductFormValues>(b),
    }),
  }),
  [`PUT ${P}/products/:id`]: ({ params, body: b }) => {
    products.update(params[0], { form: body<ProductFormValues>(b) })
    return ok
  },
  [`PATCH ${P}/products/:id/flag`]: ({ params, body: b }) => {
    const row = products.get(params[0])
    const { flag, value } = body<{ flag: ProductFlag; value: boolean }>(b)
    if (row) products.update(row.id, flagOf(row, flag, !!value))
    return ok
  },
  [`DELETE ${P}/products/:id`]: ({ params }) => {
    products.remove(params[0])
    return ok
  },
  [`POST ${P}/products/delete`]: ({ body: b }) => {
    for (const id of body<{ ids?: number[] }>(b).ids ?? []) products.remove(id)
    return ok
  },
}

export default routes
