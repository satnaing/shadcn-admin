import { mockRoutes } from '@/mocks'
import { menuFor } from '@/mocks/menu.routes'
import { mockModules } from '@/mocks/modules.data'
import { ALL_PERMISSIONS, PERMISSIONS } from '@/shared/permissions'
import { describe, expect, it } from 'vitest'
import { isModuleEnabled } from '@/hooks/use-module-enabled'
import {
  payoutSchema,
  productSharingSchema,
  registrationFormSchema,
} from './data/affiliate.schema'
import { affiliateManifest, affiliatePermissions } from './module.manifest'

type Row = Record<string, string | number | boolean | null | object>
type Body = { data: Row[] & Row & { items?: Row[] }; meta?: { total: number } }
const P = '/admin/affiliate'
const get = (
  path: string,
  query: Record<string, string> = {},
  params: string[] = []
) => mockRoutes[`GET ${P}${path}`]({ params, query }) as Body
const write = (
  method: string,
  path: string,
  body?: unknown,
  params: string[] = []
) => mockRoutes[`${method} ${P}${path}`]({ params, query: {}, body })
const all = { per_page: '1000' }

const files = import.meta.glob<string>('/public/locales/*/*.json', {
  query: '?raw',
  import: 'default',
  eager: true,
})
const locale = (lang: string, ns = 'affiliate') =>
  JSON.parse(files[`/public/locales/${lang}/${ns}.json`]) as Record<
    string,
    unknown
  >
const keys = (o: unknown, prefix = ''): string[] =>
  Object.entries(o as Record<string, unknown>).flatMap(([k, v]) =>
    v && typeof v === 'object' ? keys(v, `${prefix}${k}.`) : [`${prefix}${k}`]
  )

describe('affiliate manifest', () => {
  it('declares exactly the permissions of the single tree group', () => {
    expect([...affiliatePermissions].sort()).toEqual(
      Object.values(PERMISSIONS.AFFILIATE).sort()
    )
    expect(new Set(ALL_PERMISSIONS).size).toBe(ALL_PERMISSIONS.length)
    expect(affiliatePermissions.some((p) => p.endsWith('_own'))).toBe(false)
  })

  it('menu items live under /admin/affiliate and use declared permissions + nav keys in every language', () => {
    const { items, group } = affiliateManifest.admin_menu!
    const navs = ['en', 'az', 'tr', 'ru'].map(
      (l) => locale(l, 'nav') as Record<string, string>
    )
    for (const item of items) {
      expect(item.route.startsWith(P)).toBe(true)
      expect(affiliatePermissions).toContain(item.permission)
      for (const nav of navs) expect(nav[item.key], item.key).toBeTruthy()
    }
    for (const nav of navs) expect(nav[group.key]).toBeTruthy()
  })

  it('sidebar group disappears when the module is disabled', () => {
    const module = mockModules.find((m) => m.id === 'affiliate')!
    expect(menuFor('admin').some((g) => g.module === 'affiliate')).toBe(true)
    module.enabled = false
    expect(menuFor('admin').some((g) => g.module === 'affiliate')).toBe(false)
    module.enabled = true
  })

  it('route guard rule: disabled or missing module is not enabled', () => {
    const rows = [{ id: 'affiliate', enabled: false, installed: true }]
    expect(isModuleEnabled(rows, 'affiliate')).toBe(false)
    expect(isModuleEnabled([{ ...rows[0], enabled: true }], 'affiliate')).toBe(
      true
    )
  })

  it('has identical locale keys in az/en/tr/ru and every role group label', () => {
    const en = keys(locale('en')).sort()
    for (const l of ['az', 'tr', 'ru'])
      expect(keys(locale(l)).sort()).toEqual(en)
    for (const l of ['en', 'az', 'tr', 'ru'])
      expect(
        (locale(l, 'roles').groups as Record<string, string>).affiliate
      ).toBeTruthy()
  })
})

describe('affiliate lists mock', () => {
  it('users: `{data, meta}`, server-side q/page/tab', () => {
    expect(get('/users').meta?.total).toBeGreaterThanOrEqual(10)
    expect(get('/users', { page: '2', per_page: '5' }).data).toHaveLength(5)
    const first = get('/users', all).data[0]
    expect(get('/users', { q: String(first.email), ...all }).data).toHaveLength(
      1
    )
    const pending = get('/users', { tab: 'pending', ...all }).data
    expect(pending.length).toBeGreaterThan(0)
    expect(pending.every((u) => u.is_approved === false)).toBe(true)
    expect(
      get('/users', { tab: 'approved', ...all }).data.every(
        (u) => u.is_approved === true
      )
    ).toBe(true)
    expect(first).not.toHaveProperty('verification')
  })

  it('referrals and logs: paged, logs filter by commission type', () => {
    expect(get('/referrals').meta?.total).toBeGreaterThanOrEqual(10)
    const logs = get('/logs', all).data
    expect(logs.length).toBeGreaterThanOrEqual(10)
    const sharing = get('/logs', { tab: 'product_sharing', ...all }).data
    expect(sharing.length).toBeGreaterThan(0)
    expect(sharing.every((l) => l.affiliate_type === 'product_sharing')).toBe(
      true
    )
    expect(logs.some((l) => l.referral_name === null && l.guest_id)).toBe(true)
  })

  it('withdraws: tab filter', () => {
    const pending = get('/withdraws', { tab: 'pending', ...all }).data
    expect(pending.length).toBeGreaterThan(0)
    expect(pending.every((w) => w.status === 'pending')).toBe(true)
  })
})

describe('affiliate writes are visible on the next read', () => {
  it('approval toggle and reject (clears the submitted form)', () => {
    const pending = get('/users', { tab: 'pending', ...all }).data.find(
      (u) => u.has_verification
    )!
    write('PATCH', '/users/:id/status', { is_approved: true }, [
      String(pending.id),
    ])
    expect(get('/users/:id', {}, [String(pending.id)]).data.is_approved).toBe(
      true
    )
    write('POST', '/users/:id/reject', undefined, [String(pending.id)])
    const after = get('/users/:id', {}, [String(pending.id)]).data
    expect(after.is_approved).toBe(false)
    expect(after.verification).toEqual([])
    expect(
      get('/users', all).data.find((u) => u.id === pending.id)?.has_verification
    ).toBe(false)
  })

  it('payout lowers the balance, adds a payment and refuses more than the balance', () => {
    const user = get('/users', { tab: 'approved', ...all }).data.find(
      (u) => Number(u.balance) > 50
    )!
    const before = Number(user.balance)
    const count =
      get('/users/:id/payments', {}, [String(user.id)]).meta?.total ?? 0
    write(
      'POST',
      '/users/:id/pay',
      { amount: before + 1, payment_method: 'Bank' },
      [String(user.id)]
    )
    expect(Number(get('/users/:id', {}, [String(user.id)]).data.balance)).toBe(
      before
    )
    write('POST', '/users/:id/pay', { amount: 20, payment_method: 'Paypal' }, [
      String(user.id),
    ])
    expect(Number(get('/users/:id', {}, [String(user.id)]).data.balance)).toBe(
      before - 20
    )
    const payments = get('/users/:id/payments', {}, [String(user.id)])
    expect(payments.meta?.total).toBe(count + 1)
    expect(payments.data[0]).toMatchObject({
      amount: 20,
      payment_method: 'Paypal',
    })
  })

  it('withdraw: paying approves it and records a payment; rejecting returns the held amount', () => {
    const [a, b] = get('/withdraws', { tab: 'pending', ...all }).data
    write('POST', '/withdraws/:id/pay', { payment_method: 'Bank' }, [
      String(a.id),
    ])
    expect(get('/withdraws', all).data.find((w) => w.id === a.id)?.status).toBe(
      'approved'
    )
    expect(
      get('/users/:id/payments', {}, [String(a.affiliate_user_id)]).data[0]
    ).toMatchObject({ amount: a.amount, payment_method: 'Bank' })

    const before = Number(
      get('/users/:id', {}, [String(b.affiliate_user_id)]).data.balance
    )
    write('POST', '/withdraws/:id/reject', undefined, [String(b.id)])
    expect(get('/withdraws', all).data.find((w) => w.id === b.id)?.status).toBe(
      'rejected'
    )
    expect(
      Number(get('/users/:id', {}, [String(b.affiliate_user_id)]).data.balance)
    ).toBeCloseTo(before + Number(b.amount), 2)
    // a decided request cannot be decided again
    write('POST', '/withdraws/:id/reject', undefined, [String(b.id)])
    expect(
      Number(get('/users/:id', {}, [String(b.affiliate_user_id)]).data.balance)
    ).toBeCloseTo(before + Number(b.amount), 2)
  })

  it('commission options: product sharing and category-wise exclude each other', () => {
    expect(get('/options').data.category_wise_affiliate).toMatchObject({
      status: true,
    })
    write(
      'PUT',
      '/options/:type',
      { status: true, commission: 12, commission_type: 'percent' },
      ['product_sharing']
    )
    const options = get('/options').data
    expect(options.product_sharing).toMatchObject({
      status: true,
      commission: 12,
    })
    expect(options.category_wise_affiliate).toMatchObject({ status: false })
    write('PUT', '/options/:type', { status: true }, [
      'category_wise_affiliate',
    ])
    expect(get('/options').data.product_sharing).toMatchObject({
      status: false,
    })
  })

  it('settings and registration form', () => {
    write('PUT', '/settings', {
      minimum_withdraw_amount: 55,
      validation_days: 14,
    })
    expect(get('/settings').data).toMatchObject({
      minimum_withdraw_amount: 55,
      validation_days: 14,
    })
    write('PUT', '/registration-form', {
      elements: [{ type: 'text', label: 'Phone', options: [] }],
    })
    expect(get('/registration-form').data).toEqual([
      { type: 'text', label: 'Phone', options: [] },
    ])
  })
})

describe('affiliate schemas', () => {
  it('payout is limited to the balance (AEC allowed any amount)', () => {
    const schema = payoutSchema(50)
    expect(
      schema.safeParse({ amount: 50, payment_method: 'Bank' }).success
    ).toBe(true)
    expect(
      schema.safeParse({ amount: 50.01, payment_method: 'Bank' }).success
    ).toBe(false)
    expect(
      schema.safeParse({ amount: 0, payment_method: 'Bank' }).success
    ).toBe(false)
    expect(
      schema.safeParse({ amount: 10, payment_method: 'Cash' }).success
    ).toBe(false)
  })

  it('a percent commission cannot exceed 100, a fixed amount can', () => {
    const base = { status: true, commission: 150 }
    expect(
      productSharingSchema.safeParse({ ...base, commission_type: 'percent' })
        .success
    ).toBe(false)
    expect(
      productSharingSchema.safeParse({ ...base, commission_type: 'amount' })
        .success
    ).toBe(true)
  })

  it('choice fields need at least one non-empty option', () => {
    const select = (options: string[]) => ({
      elements: [{ type: 'select', label: 'Channel', options }],
    })
    expect(registrationFormSchema.safeParse(select([])).success).toBe(false)
    expect(registrationFormSchema.safeParse(select([''])).success).toBe(false)
    expect(registrationFormSchema.safeParse(select(['Blog'])).success).toBe(
      true
    )
    expect(
      registrationFormSchema.safeParse({
        elements: [{ type: 'file', label: 'ID', options: [] }],
      }).success
    ).toBe(true)
  })
})
