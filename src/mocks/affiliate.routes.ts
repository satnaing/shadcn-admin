import type { PayoutPayload } from '@/api/modules/affiliate.api'
import type {
  AffiliateOptions,
  AffiliateSettings,
  AffiliateUserDetail,
  FormElement,
  PayMethod,
} from '@/features/affiliate/data/affiliate.type'
import {
  seedForm,
  seedLogs,
  seedOptions,
  seedPayments,
  seedReferrals,
  seedSettings,
  seedUsers,
  seedWithdraws,
} from './affiliate.data'
import { createCollection, type Handler, paginate, type Query } from './helpers'

const users = createCollection(seedUsers)
const payments = createCollection(seedPayments)
const withdraws = createCollection(seedWithdraws)
let settings: AffiliateSettings = { ...seedSettings }
let options: AffiliateOptions = seedOptions()
let form: FormElement[] = seedForm.map((e) => ({
  ...e,
  options: [...e.options],
}))

const P = '/admin/affiliate'
const body = <T>(b: unknown) => (b ?? {}) as T
const ok = { message: 'ok' }
// paginate() is typed for loose records; rows are cloned so React Query sees changes after in-place writes
const rows = <T extends object>(fn: () => T[]) =>
  (() => fn().map((r) => ({ ...r }))) as unknown as () => Record<
    string,
    unknown
  >[]

/** List rows carry the badge flags only; address, payout info and the submitted form come from the detail endpoint. */
const userItem = ({
  address: _a,
  paypal_email: _p,
  bank_information: _b,
  verification: _v,
  ...item
}: AffiliateUserDetail) => item

const userList = (q: Query) =>
  users
    .all()
    .filter((u) =>
      q.tab === 'pending'
        ? !u.is_approved
        : q.tab === 'approved'
          ? u.is_approved
          : true
    )
    .map(userItem)

const withdrawList = (q: Query) =>
  withdraws.all().filter((w) => !q.tab || q.tab === 'all' || w.status === q.tab)

const logList = (q: Query) =>
  seedLogs.filter(
    (l) => !q.tab || q.tab === 'all' || l.affiliate_type === q.tab
  )

const addPayment = (
  user_id: number,
  amount: number,
  payment_method: PayMethod
) =>
  payments.create(
    { user_id, amount, payment_method, created_at: new Date().toISOString() },
    'start'
  )

const routes: Record<string, Handler> = {
  [`GET ${P}/settings`]: () => ({ data: settings }),
  [`PUT ${P}/settings`]: ({ body: b }) => {
    settings = { ...settings, ...body<AffiliateSettings>(b) }
    return ok
  },

  [`GET ${P}/options`]: () => ({ data: options }),
  [`PUT ${P}/options/:type`]: ({ params, body: b }) => {
    const type = params[0] as keyof AffiliateOptions
    const values = body<{ status: boolean }>(b)
    options = { ...options, [type]: { ...options[type], ...values } }
    // AEC rule: single-product sharing and category-wise commissions cannot be active together
    if (values.status && type === 'product_sharing')
      options.category_wise_affiliate.status = false
    if (values.status && type === 'category_wise_affiliate')
      options.product_sharing.status = false
    return ok
  },

  [`GET ${P}/registration-form`]: () => ({ data: form }),
  [`PUT ${P}/registration-form`]: ({ body: b }) => {
    form = body<{ elements: FormElement[] }>(b).elements ?? []
    return ok
  },

  [`GET ${P}/users`]: (ctx) => paginate(rows(() => userList(ctx.query)))(ctx),
  [`GET ${P}/users/:id`]: ({ params }) => ({
    data: { ...(users.get(params[0]) ?? users.all()[0]) },
  }),
  [`PATCH ${P}/users/:id/status`]: ({ params, body: b }) => {
    users.update(params[0], {
      is_approved: !!body<{ is_approved: boolean }>(b).is_approved,
    })
    return ok
  },
  [`POST ${P}/users/:id/reject`]: ({ params }) => {
    users.update(params[0], {
      is_approved: false,
      has_verification: false,
      verification: [],
    })
    return ok
  },
  [`POST ${P}/users/:id/pay`]: ({ params, body: b }) => {
    const user = users.get(params[0])
    const v = body<PayoutPayload>(b)
    if (user && v.amount > 0 && v.amount <= user.balance) {
      users.update(user.id, {
        balance: Math.round((user.balance - v.amount) * 100) / 100,
      })
      addPayment(user.id, v.amount, v.payment_method)
    }
    return ok
  },
  [`GET ${P}/users/:id/payments`]: (ctx) =>
    paginate(
      rows(() =>
        payments.all().filter((p) => String(p.user_id) === ctx.params[0])
      )
    )(ctx),

  [`GET ${P}/referrals`]: paginate(rows(() => seedReferrals)),

  [`GET ${P}/withdraws`]: (ctx) =>
    paginate(rows(() => withdrawList(ctx.query)))(ctx),
  [`POST ${P}/withdraws/:id/pay`]: ({ params, body: b }) => {
    const request = withdraws.get(params[0])
    // the balance was already held back when the request was made, so paying only records the payment
    if (request?.status === 'pending') {
      withdraws.update(request.id, { status: 'approved' })
      addPayment(
        request.affiliate_user_id,
        request.amount,
        body<{ payment_method: PayMethod }>(b).payment_method
      )
    }
    return ok
  },
  [`POST ${P}/withdraws/:id/reject`]: ({ params }) => {
    const request = withdraws.get(params[0])
    if (request?.status === 'pending') {
      withdraws.update(request.id, { status: 'rejected' })
      const user = users.get(request.affiliate_user_id)
      if (user)
        users.update(user.id, {
          balance: Math.round((user.balance + request.amount) * 100) / 100,
        })
    }
    return ok
  },

  [`GET ${P}/logs`]: (ctx) => paginate(rows(() => logList(ctx.query)))(ctx),
}

export default routes
