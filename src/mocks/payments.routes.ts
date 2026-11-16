import { isPayriffConfigured, maskPayriff, mergePayriff } from '@/features/payments/data/payments.payriff'
import type {
  ManualMethod,
  PayoutMethod,
  PayriffSettings,
  RechargePayload,
  WalletRequest,
} from '@/features/payments/data/payments.type'
import {
  seedCustomerPackages,
  seedCustomers,
  seedManual,
  seedOrders,
  seedPayouts,
  seedPayriff,
  seedSellerPackages,
  seedWallet,
} from './payments.data'
import { createCollection, type Handler, paginate } from './helpers'

const manual = createCollection(seedManual)
const orders = createCollection(seedOrders)
const wallet = createCollection(seedWallet)
const sellerPackages = createCollection(seedSellerPackages)
const customerPackages = createCollection(seedCustomerPackages)
const payouts = createCollection(seedPayouts)
let payriff: PayriffSettings = { ...seedPayriff }

const P = '/admin/payments'
const body = <T>(b: unknown) => (b ?? {}) as T
const ok = { message: 'ok' }
// paginate() is typed for loose records; rows are cloned so React Query sees changes after in-place writes
const rows = <T extends object>(fn: () => T[]) =>
  (() => fn().map((r) => ({ ...r }))) as unknown as () => Record<string, unknown>[]

/** `?tab=` is a server filter; the first tab of each list means "everything". */
const tabbed = <T extends object>(all: () => T[], keep: (row: T, tab: string) => boolean): Handler =>
  (ctx) => paginate(rows(() => all().filter((r) => !ctx.query.tab || keep(r, ctx.query.tab))))(ctx)

const approveIn = (collection: ReturnType<typeof createCollection<{ id: number; approved: boolean }>>): Handler =>
  ({ params }) => {
    collection.update(params[0], { approved: true })
    return ok
  }

const routes: Record<string, Handler> = {
  [`GET ${P}/manual-methods`]: (ctx) => paginate(rows(() => manual.all()))(ctx),
  [`POST ${P}/manual-methods`]: ({ body: b }) => ({ ...ok, data: manual.create(body<Omit<ManualMethod, 'id'>>(b), 'start') }),
  [`PUT ${P}/manual-methods/:id`]: ({ params, body: b }) => {
    manual.update(params[0], body<Partial<ManualMethod>>(b))
    return ok
  },
  [`DELETE ${P}/manual-methods/:id`]: ({ params }) => {
    manual.remove(params[0])
    return ok
  },

  [`GET ${P}/offline-orders`]: tabbed(() => orders.all(), (r, tab) => r.payment_status === tab),

  [`GET ${P}/wallet-requests`]: tabbed(
    () => wallet.all(),
    (r, tab) =>
      ({
        pending: !r.approved,
        approved: r.approved,
        by_admin: r.added_by === 'admin',
        by_customer: r.added_by === 'customer',
      })[tab] ?? true
  ),
  // already approved requests are skipped, so a request is never credited twice
  [`POST ${P}/wallet-requests/approve`]: ({ body: b }) => {
    for (const id of body<{ ids: number[] }>(b).ids) {
      if (wallet.get(id) && !wallet.get(id).approved) wallet.update(id, { approved: true })
    }
    return ok
  },
  [`POST ${P}/wallet-recharges`]: ({ body: b }) => {
    const v = body<RechargePayload>(b)
    const customer = seedCustomers.find((c) => c.id === v.user_id)
    if (!customer || !(v.amount > 0)) return { message: 'invalid' }
    const row: Omit<WalletRequest, 'id'> = {
      customer: customer.name,
      amount: v.amount,
      method: null,
      trx_id: v.trx_id,
      receipt: v.photo || null,
      approved: true,
      added_by: 'admin',
      created_at: new Date().toISOString(),
    }
    return { ...ok, data: wallet.create(row, 'start') }
  },
  [`GET ${P}/customers`]: ({ query }) => {
    const needle = (query.q ?? '').trim().toLowerCase()
    return { data: seedCustomers.filter((c) => `${c.name} ${c.email}`.toLowerCase().includes(needle)).slice(0, 20) }
  },

  [`GET ${P}/seller-package-requests`]: (ctx) => paginate(rows(() => sellerPackages.all()))(ctx),
  [`POST ${P}/seller-package-requests/:id/approve`]: approveIn(sellerPackages),
  [`GET ${P}/customer-package-requests`]: (ctx) => paginate(rows(() => customerPackages.all()))(ctx),
  [`POST ${P}/customer-package-requests/:id/approve`]: approveIn(customerPackages),

  [`GET ${P}/payout-methods`]: (ctx) => paginate(rows(() => payouts.all()))(ctx),
  [`POST ${P}/payout-methods`]: ({ body: b }) => ({
    ...ok,
    data: payouts.create({ ...body<Omit<PayoutMethod, 'id' | 'created_at'>>(b), created_at: new Date().toISOString() }, 'start'),
  }),
  [`POST ${P}/payout-methods/bulk-delete`]: ({ body: b }) => {
    body<{ ids: number[] }>(b).ids.forEach((id) => payouts.remove(id))
    return ok
  },
  [`PUT ${P}/payout-methods/:id`]: ({ params, body: b }) => {
    payouts.update(params[0], body<Partial<PayoutMethod>>(b))
    return ok
  },
  [`DELETE ${P}/payout-methods/:id`]: ({ params }) => {
    payouts.remove(params[0])
    return ok
  },

  [`GET ${P}/payriff`]: () => ({ data: maskPayriff(payriff) }),
  // static `activation` path first: it must not be read as anything else
  [`PUT ${P}/payriff/activation`]: ({ body: b }) => {
    const { active } = body<{ active: boolean }>(b)
    if (active && !isPayriffConfigured(payriff)) return { message: 'not configured' }
    payriff = { ...payriff, active }
    return ok
  },
  [`PUT ${P}/payriff`]: ({ body: b }) => {
    payriff = mergePayriff(payriff, body<Omit<PayriffSettings, 'active'>>(b))
    // switching mode to one without credentials turns the gateway off (it would fail at checkout)
    if (!isPayriffConfigured(payriff)) payriff.active = false
    return ok
  },
}

export default routes
