import type { CourierFormValues } from '@/features/courier/data/courier.schema'
import type { CourierSettings } from '@/features/courier/data/courier.type'
import {
  type MockDelivery,
  seedCollections,
  seedCouriers,
  seedDeliveries,
  seedHistory,
  seedLookups,
  seedPayments,
  seedSettings,
} from './courier.data'
import { createCollection, type Handler, paginate, type Query } from './helpers'

const couriers = createCollection(seedCouriers)
const payments = createCollection(seedPayments)
const collections = createCollection(seedCollections)
const deliveries = createCollection(seedDeliveries)
const history = createCollection(seedHistory)
let settings: CourierSettings = { ...seedSettings }

const P = '/admin/courier'
const body = <T>(b: unknown) => (b ?? {}) as T
const ok = { message: 'ok' }
// paginate() is typed for loose records; rows are cloned so React Query sees changes after in-place writes
const rows = <T extends object>(fn: () => T[]) =>
  (() => fn().map((r) => ({ ...r }))) as unknown as () => Record<
    string,
    unknown
  >[]
const publicCourier = ({
  password: _password,
  ...c
}: (typeof seedCouriers)[number]) => c
const round2 = (n: number) => Math.round(n * 100) / 100

/** AEC stage → delivery rows (assigned = not yet picked up, pending = anything still open). */
const STAGES: Record<string, (d: MockDelivery) => boolean> = {
  assigned: (d) =>
    ['pending', 'confirmed'].includes(d.delivery_status) && !d.cancel_request,
  pickup: (d) => d.delivery_status === 'picked_up' && !d.cancel_request,
  on_the_way: (d) => d.delivery_status === 'on_the_way' && !d.cancel_request,
  completed: (d) => d.delivery_status === 'delivered',
  pending: (d) =>
    !['delivered', 'cancelled'].includes(d.delivery_status) &&
    !d.cancel_request,
  cancelled: (d) => d.delivery_status === 'cancelled',
}
const deliveryList = (q: Query) =>
  deliveries
    .all()
    .filter((d) => !q.tab || (STAGES[q.tab]?.(d) ?? true))
    .map(({ courier_name: _name, cancel_requested_at: _at, ...d }) => d)

/** The client validates the amount; the mock ignores an amount the courier cannot cover. */
const settle = (
  id: string,
  amount: number,
  field: 'total_earning' | 'total_collection',
  log: typeof payments
) => {
  const courier = couriers.get(id)
  if (courier && amount > 0 && amount <= courier[field]) {
    couriers.update(id, { [field]: round2(courier[field] - amount) })
    log.create(
      {
        courier_name: courier.name,
        amount,
        created_at: new Date().toISOString(),
      },
      'start'
    )
  }
  return ok
}

const ledger = (
  fn: () => Array<{
    id: number
    order_code: string
    payment_type: string
    amount: number
    created_at: string
  }>
) => rows(fn)

const routes: Record<string, Handler> = {
  [`GET ${P}/couriers`]: (ctx) =>
    paginate(rows(() => couriers.all().map(publicCourier)))(ctx),
  [`POST ${P}/couriers`]: ({ body: b }) => {
    const v = body<CourierFormValues>(b)
    couriers.create(
      {
        ...v,
        banned: false,
        total_earning: 0,
        total_collection: 0,
        created_at: new Date().toISOString(),
      },
      'start'
    )
    return ok
  },
  [`PUT ${P}/couriers/:id/ban`]: ({ params, body: b }) => {
    couriers.update(params[0], { banned: body<{ banned: boolean }>(b).banned })
    return ok
  },
  [`POST ${P}/couriers/:id/collect`]: ({ params, body: b }) =>
    settle(
      params[0],
      body<{ amount: number }>(b).amount,
      'total_collection',
      collections
    ),
  [`POST ${P}/couriers/:id/pay`]: ({ params, body: b }) =>
    settle(
      params[0],
      body<{ amount: number }>(b).amount,
      'total_earning',
      payments
    ),
  [`GET ${P}/couriers/:id`]: ({ params }) => ({
    data: publicCourier(couriers.get(params[0]) ?? couriers.all()[0]),
  }),
  [`PUT ${P}/couriers/:id`]: ({ params, body: b }) => {
    const { password, ...v } = body<CourierFormValues>(b)
    couriers.update(params[0], password ? { ...v, password } : v)
    return ok
  },
  [`GET ${P}/lookups`]: () => ({ data: seedLookups }),

  [`GET ${P}/payments`]: (ctx) => paginate(rows(() => payments.all()))(ctx),
  [`GET ${P}/collections`]: (ctx) =>
    paginate(rows(() => collections.all()))(ctx),
  [`GET ${P}/cancel-requests`]: (ctx) =>
    paginate(
      rows(() =>
        deliveries
          .all()
          .filter((d) => d.cancel_request && d.delivery_status !== 'cancelled')
          .map((d) => ({
            id: d.id,
            order_code: d.order_code,
            courier_name: d.courier_name,
            requested_at: d.cancel_requested_at ?? d.assigned_at,
          }))
      )
    )(ctx),

  [`GET ${P}/settings`]: () => ({ data: settings }),
  [`PUT ${P}/settings`]: ({ body: b }) => {
    settings = { ...settings, ...body<Partial<CourierSettings>>(b) }
    return ok
  },

  [`GET ${P}/deliveries`]: (ctx) =>
    paginate(rows(() => deliveryList(ctx.query)))(ctx),
  [`POST ${P}/deliveries/:id/cancel-request`]: ({ params }) => {
    deliveries.update(params[0], {
      cancel_request: true,
      cancel_requested_at: new Date().toISOString(),
    })
    return ok
  },
  [`GET ${P}/cash`]: (ctx) =>
    paginate(
      ledger(() =>
        history
          .all()
          .filter((h) => h.payment_type === 'cash_on_delivery')
          .map((h) => ({ ...h, amount: h.collection }))
      )
    )(ctx),
  [`GET ${P}/earnings`]: (ctx) =>
    paginate(
      ledger(() => history.all().map((h) => ({ ...h, amount: h.earning })))
    )(ctx),
}

export default routes
