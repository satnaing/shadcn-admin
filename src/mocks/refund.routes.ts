import type { PayPayload } from '@/api/modules/refund.api'
import type { RefundSettings } from '@/features/refund/data/refund.type'
import { createCollection, type Handler, paginate, type Query } from './helpers'
import { type CategoryRow, type ReasonRow, type RefundRow, seedCategories, seedReasons, seedRefunds, seedSettings } from './refund.data'

const refunds = createCollection(seedRefunds)
const reasons = createCollection(seedReasons)
const categories = createCollection(seedCategories)
let settings: RefundSettings = { ...seedSettings }

const P = '/admin/refund'
const body = <T>(b: unknown) => (b ?? {}) as T
const now = () => new Date().toISOString()
// paginate() is typed for loose records; rows are cloned so React Query sees changes after in-place writes
const rows = <T extends object>(fn: () => T[]) => (() => fn().map((r) => ({ ...r }))) as unknown as () => Record<string, unknown>[]

/** The status a list tab filters on: the refund itself, or the dispute when listing disputes. */
const tabMatch = (r: RefundRow, tab: string | undefined, disputes: boolean) => {
  const status = disputes ? r.dispute?.status : r.status
  switch (tab) {
    case 'admin': return r.seller_type === 'admin'
    case 'seller': return r.seller_type === 'seller'
    case 'pending': case 'approved': case 'rejected': return status === tab
    case 'wallet': case 'offline': return r.payment_channel === tab
    default: return true
  }
}

const filterRefunds = (q: Query, disputes: boolean) =>
  refunds.all().filter((r) => (!disputes || r.dispute) && tabMatch(r, q.tab, disputes))
    .map((r) => ({ ...r, dispute_status: r.dispute?.status ?? null }))

const reasonList = (q: Query) =>
  reasons.all().filter((r) => (!q.kind || r.kind === q.kind) && (q.active !== '1' || r.is_active))

const descendants = (id: number): number[] => {
  const children = categories.all().filter((c) => c.parent_id === id)
  return [id, ...children.flatMap((c) => descendants(c.id))]
}

const setDays = (ids: number[], refund_days: number) => {
  for (const id of new Set(ids.flatMap(descendants))) categories.update(id, { refund_days })
}

const categoryList = (q: Query) => {
  const names = new Map(categories.all().map((c) => [c.id, c.name]))
  return categories.all()
    .filter((c) => (q.main !== '1' || c.parent_id === null) && (q.unassigned !== '1' || c.refund_days === 0))
    .map((c: CategoryRow) => ({ id: c.id, name: c.name, parent_name: c.parent_id ? names.get(c.parent_id) ?? null : null, icon: c.icon, refund_days: c.refund_days }))
}

const pay = (disputes: boolean): Handler => ({ params, body: b }) => {
  const r = refunds.get(params[0])
  const v = body<PayPayload>(b)
  if (!r) return { message: 'ok' }
  const offline = v.method === 'offline'
  if (disputes && r.dispute?.status === 'pending') {
    r.dispute = { ...r.dispute, status: 'approved', decided_at: now(), transaction_id: offline ? v.transaction_id ?? null : null, receipt: offline ? v.receipt || null : null }
  } else if (!disputes && r.status === 'pending') {
    refunds.update(r.id, {
      status: 'approved', admin_decision: 'approved', paid_at: now(), decided_at: now(), payment_channel: v.method,
      transaction_id: offline ? v.transaction_id ?? null : null, receipt: offline ? v.receipt || null : null,
    })
  }
  return { message: 'ok' }
}

const reject = (disputes: boolean): Handler => ({ params, body: b }) => {
  const r = refunds.get(params[0])
  const reason = body<{ reason: string }>(b).reason
  if (!r) return { message: 'ok' }
  if (disputes && r.dispute?.status === 'pending') {
    r.dispute = { ...r.dispute, status: 'rejected', decided_at: now(), reject_reason: reason }
  } else if (!disputes && r.status === 'pending') {
    refunds.update(r.id, { status: 'rejected', admin_decision: 'rejected', decided_at: now(), reject_reason: reason })
  }
  return { message: 'ok' }
}

const routes: Record<string, Handler> = {
  [`GET ${P}/requests`]: (ctx) => paginate(rows(() => filterRefunds(ctx.query, false)))(ctx),
  [`GET ${P}/disputes`]: (ctx) => paginate(rows(() => filterRefunds(ctx.query, true)))(ctx),
  [`GET ${P}/requests/:id`]: ({ params }) => ({ data: { ...(refunds.get(params[0]) ?? refunds.all()[0]) } }),
  [`POST ${P}/requests/:id/pay`]: pay(false),
  [`POST ${P}/requests/:id/reject`]: reject(false),
  [`POST ${P}/disputes/:id/pay`]: pay(true),
  [`POST ${P}/disputes/:id/reject`]: reject(true),

  [`GET ${P}/reasons`]: (ctx) => paginate(rows(() => reasonList(ctx.query)))(ctx),
  [`POST ${P}/reasons`]: ({ body: b }) => {
    const v = body<Pick<ReasonRow, 'kind' | 'translations'>>(b)
    return { message: 'ok', data: reasons.create({ ...v, reason: v.translations.az, is_active: true, created_at: now() }, 'start') }
  },
  [`PUT ${P}/reasons/:id`]: ({ params, body: b }) => {
    const v = body<Pick<ReasonRow, 'kind' | 'translations'>>(b)
    reasons.update(params[0], { ...v, reason: v.translations.az })
    return { message: 'ok' }
  },
  [`DELETE ${P}/reasons/:id`]: ({ params }) => {
    reasons.remove(params[0])
    return { message: 'ok' }
  },
  [`PATCH ${P}/reasons/status`]: ({ body: b }) => {
    const { ids, is_active } = body<{ ids: number[]; is_active: boolean }>(b)
    for (const id of ids ?? []) reasons.update(id, { is_active })
    return { message: 'ok' }
  },

  [`GET ${P}/categories`]: (ctx) => paginate(rows(() => categoryList(ctx.query)))(ctx),
  [`PUT ${P}/categories/:id`]: ({ params, body: b }) => {
    setDays([Number(params[0])], body<{ refund_days: number }>(b).refund_days)
    return { message: 'ok' }
  },
  [`POST ${P}/categories/bulk-days`]: ({ body: b }) => {
    const v = body<{ ids: number[]; refund_days: number }>(b)
    setDays(v.ids ?? [], v.refund_days)
    return { message: 'ok' }
  },

  [`GET ${P}/settings`]: () => ({ data: settings }),
  [`PUT ${P}/settings`]: ({ body: b }) => {
    settings = { ...settings, ...body<RefundSettings>(b) }
    return { message: 'ok' }
  },
}

export default routes
