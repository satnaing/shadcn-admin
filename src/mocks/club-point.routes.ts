import type {
  ClubPointSettings,
  EarningDetail,
  RangePayload,
} from '@/features/club-point/data/club-point.type'
import { seedEarnings, seedProducts, seedSettings } from './club-point.data'
import { createCollection, type Handler, paginate, type Query } from './helpers'

const earnings = createCollection(seedEarnings)
const products = createCollection(seedProducts)
let settings: ClubPointSettings = { ...seedSettings }

const P = '/admin/club-point'
const body = <T>(b: unknown) => (b ?? {}) as T
const ok = { message: 'ok' }
// paginate() is typed for loose records; rows are cloned so React Query sees changes after in-place writes
const rows = <T extends object>(fn: () => T[]) =>
  (() => fn().map((r) => ({ ...r }))) as unknown as () => Record<
    string,
    unknown
  >[]

/** List rows carry no lines; they come from the detail endpoint. */
const earningItem = ({ lines: _lines, ...item }: EarningDetail) => item

const earningList = (q: Query) =>
  earnings
    .all()
    .filter((e) => !q.tab || q.tab === 'all' || e.convert_status === q.tab)
    .map(earningItem)

const round2 = (n: number) => Math.round(n * 100) / 100

const routes: Record<string, Handler> = {
  [`GET ${P}/earnings`]: (ctx) =>
    paginate(rows(() => earningList(ctx.query)))(ctx),
  [`GET ${P}/earnings/:id`]: ({ params }) => ({
    data: { ...(earnings.get(params[0]) ?? earnings.all()[0]) },
  }),

  [`GET ${P}/products`]: (ctx) => paginate(rows(() => products.all()))(ctx),
  // static paths first: `products/:id` would otherwise swallow `range` / `all`
  [`POST ${P}/products/range`]: ({ body: b }) => {
    const v = body<RangePayload>(b)
    const hit = products
      .all()
      .filter((p) => p.unit_price >= v.min_price && p.unit_price <= v.max_price)
    hit.forEach((p) => products.update(p.id, { earn_point: v.point }))
    return { ...ok, data: { updated: hit.length } }
  },
  [`POST ${P}/products/all`]: ({ body: b }) => {
    const { point } = body<{ point: number }>(b)
    // AEC: points per currency unit, so a 100 price at 0.5 earns 50
    products
      .all()
      .forEach((p) =>
        products.update(p.id, { earn_point: round2(p.unit_price * point) })
      )
    return { ...ok, data: { updated: products.all().length } }
  },
  [`PUT ${P}/products/:id`]: ({ params, body: b }) => {
    products.update(params[0], { earn_point: body<{ point: number }>(b).point })
    return ok
  },

  [`GET ${P}/settings`]: () => ({ data: settings }),
  [`PUT ${P}/settings`]: ({ body: b }) => {
    settings = { ...settings, ...body<ClubPointSettings>(b) }
    return ok
  },
}

export default routes
