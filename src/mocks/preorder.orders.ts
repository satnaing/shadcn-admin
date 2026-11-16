import { canSetStep } from '@/features/preorder/data/preorder.helpers'
import {
  type OrderStatusFilter,
  type OrderStep,
  type StepPayload,
} from '@/features/preorder/data/preorder.type'
import { createCollection, type Query } from './helpers'
import {
  ago,
  type OrderRow,
  seedCommissions,
  seedOrders,
} from './preorder.data'

export const orders = createCollection(seedOrders)
export const commissions = createCollection(seedCommissions)

const DAY = 86_400_000
const older = (iso: string | null) =>
  !!iso && Date.now() - new Date(iso).getTime() > DAY

/** AEC "delayed prepayment": accepted request, deposit still missing for more than a day. */
export const delayedPrepayment = (o: OrderRow) =>
  o.is_prepayment &&
  o.steps.request === 'accepted' &&
  o.steps.prepayment === 'none' &&
  o.steps.final === 'none' &&
  older(o.step_at.request)

/** AEC "delayed final": deposit accepted (or no deposit and request accepted) but no final order for more than a day. */
export const delayedFinal = (o: OrderRow) =>
  o.steps.final === 'none' &&
  (o.is_prepayment
    ? o.steps.prepayment === 'accepted' && older(o.step_at.prepayment)
    : o.steps.request === 'accepted' && older(o.step_at.request))

const SCOPE: Record<string, (o: OrderRow) => boolean> = {
  inhouse: (o) => o.owner_type === 'admin',
  seller: (o) => o.owner_type === 'seller',
  delayed_prepayment: delayedPrepayment,
  delayed_final: delayedFinal,
}

export const inScope = (o: OrderRow, scope?: string) =>
  !scope || scope === 'all' || (SCOPE[scope]?.(o) ?? true)

const STATUS: Record<
  Exclude<OrderStatusFilter, 'all'>,
  (o: OrderRow) => boolean
> = {
  requested: (o) => o.steps.request === 'pending',
  accepted_requests: (o) =>
    o.steps.request === 'accepted' && o.steps.prepayment === 'none',
  prepayment_requests: (o) => o.steps.prepayment === 'pending',
  confirmed_prepayments: (o) =>
    o.steps.prepayment === 'accepted' && o.steps.final === 'none',
  final_preorders: (o) =>
    o.steps.final === 'pending' || o.steps.final === 'accepted',
  in_shipping: (o) =>
    o.steps.shipping === 'accepted' && o.steps.delivery === 'none',
  delivered: (o) => o.steps.delivery === 'accepted',
  refund: (o) => o.steps.refund === 'accepted',
}

export const hasStatus = (o: OrderRow, status?: string) =>
  !status ||
  status === 'all' ||
  (STATUS[status as keyof typeof STATUS]?.(o) ?? true)

const inRange = (o: OrderRow, from?: string, to?: string) => {
  const day = o.created_at.slice(0, 10)
  return (!from || day >= from) && (!to || day <= to)
}

export const filterOrders = (q: Query) =>
  orders
    .all()
    .filter(
      (o) =>
        inScope(o, q.scope) && hasStatus(o, q.stage) && inRange(o, q.from, q.to)
    )

export const counts = (scope?: string) => {
  const rows = orders.all().filter((o) => inScope(o, scope))
  return {
    all: rows.length,
    ...Object.fromEntries(
      Object.entries(STATUS).map(([k, fn]) => [k, rows.filter(fn).length])
    ),
  }
}

export function applyStep(
  o: OrderRow,
  step: OrderStep,
  payload: StepPayload,
  commissionRate: number
) {
  if (!canSetStep(o.steps, step)) return false
  o.steps = { ...o.steps, [step]: payload.status }
  o.step_at = { ...o.step_at, [step]: new Date().toISOString() }
  o.step_notes = { ...o.step_notes, [step]: payload.note ?? '' }
  if (step === 'shipping') o.shipping_proof = payload.proof ?? ''
  if (
    step === 'delivery' &&
    payload.status === 'accepted' &&
    o.owner_type === 'seller' &&
    commissionRate > 0
  ) {
    const admin_commission = Math.round(
      ((o.subtotal - o.coupon_discount) * commissionRate) / 100
    )
    commissions.create(
      {
        order_id: o.id,
        order_code: o.code,
        seller_name: o.owner_name,
        admin_commission,
        seller_earning: o.grand_total - admin_commission,
        created_at: ago(0),
      },
      'start'
    )
  }
  return true
}

export const listItem = (o: OrderRow) => ({ ...o, steps: { ...o.steps } })
