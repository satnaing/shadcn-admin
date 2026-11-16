import { mockRoutes } from '@/mocks'
import { menuFor } from '@/mocks/menu.routes'
import { mockModules } from '@/mocks/modules.data'
import { ALL_PERMISSIONS, PERMISSIONS } from '@/shared/permissions'
import { describe, expect, it } from 'vitest'
import { isModuleEnabled } from '@/hooks/use-module-enabled'
import { isPayriffConfigured, maskPayriff, mergePayriff } from './data/payments.payriff'
import { manualSchema, payoutSchema, payriffSchema, rechargeSchema } from './data/payments.schema'
import { SECRET_MASK, type PayriffSettings } from './data/payments.type'
import { paymentsManifest, paymentsPermissions } from './module.manifest'

type Row = Record<string, string | number | boolean | null | object>
type Body = { data: Row[] & Row; meta?: { total: number; last_page: number }; message?: string }
const P = '/admin/payments'
const get = (path: string, query: Record<string, string> = {}, params: string[] = []) =>
  mockRoutes[`GET ${P}${path}`]({ params, query }) as Body
const write = (method: string, path: string, body?: unknown, params: string[] = []) =>
  mockRoutes[`${method} ${P}${path}`]({ params, query: {}, body }) as Body
const all = { per_page: '1000' }

const files = import.meta.glob<string>('/public/locales/*/*.json', { query: '?raw', import: 'default', eager: true })
const locale = (lang: string, ns = 'payments') =>
  JSON.parse(files[`/public/locales/${lang}/${ns}.json`]) as Record<string, unknown>
const keys = (o: unknown, prefix = ''): string[] =>
  Object.entries(o as Record<string, unknown>).flatMap(([k, v]) =>
    v && typeof v === 'object' ? keys(v, `${prefix}${k}.`) : [`${prefix}${k}`]
  )

describe('payments manifest', () => {
  it('declares exactly the permissions of the single tree group', () => {
    expect([...paymentsPermissions].sort()).toEqual(Object.values(PERMISSIONS.PAYMENTS).sort())
    expect(new Set(ALL_PERMISSIONS).size).toBe(ALL_PERMISSIONS.length)
    expect(paymentsPermissions.some((p) => p.endsWith('_own'))).toBe(false)
  })

  it('menu items live under /admin/payments and use declared permissions + nav keys in every language', () => {
    const { items, group } = paymentsManifest.admin_menu!
    const navs = ['en', 'az', 'tr', 'ru'].map((l) => locale(l, 'nav') as Record<string, string>)
    expect(items).toHaveLength(7)
    for (const item of items) {
      expect(item.route.startsWith(P)).toBe(true)
      expect(paymentsPermissions).toContain(item.permission)
      for (const nav of navs) expect(nav[item.key], item.key).toBeTruthy()
    }
    for (const nav of navs) expect(nav[group.key]).toBeTruthy()
  })

  it('sidebar group disappears when the module is disabled', () => {
    const module = mockModules.find((m) => m.id === 'payments')!
    expect(menuFor('admin').some((g) => g.module === 'payments')).toBe(true)
    module.enabled = false
    expect(menuFor('admin').some((g) => g.module === 'payments')).toBe(false)
    module.enabled = true
  })

  it('route guard rule: disabled or missing module is not enabled', () => {
    const rows = [{ id: 'payments', enabled: false, installed: true }]
    expect(isModuleEnabled(rows, 'payments')).toBe(false)
    expect(isModuleEnabled([{ ...rows[0], enabled: true }], 'payments')).toBe(true)
  })

  it('has identical locale keys in az/en/tr/ru and every role group label', () => {
    const en = keys(locale('en')).sort()
    for (const l of ['az', 'tr', 'ru']) expect(keys(locale(l)).sort()).toEqual(en)
    for (const l of ['en', 'az', 'tr', 'ru']) {
      expect((locale(l, 'roles').groups as Record<string, string>).payments).toBeTruthy()
    }
  })
})

describe('payments rules', () => {
  it('a bank method needs at least one bank row; other types do not (AEC crashed on an empty list)', () => {
    const base = { type: 'bank_payment', heading: 'Bank', description: '', photo: '', bank_info: [] }
    expect(manualSchema.safeParse(base).success).toBe(false)
    const row = { bank_name: 'ABB', account_name: 'Xshop', account_number: 'AZ00', routing_number: '' }
    expect(manualSchema.safeParse({ ...base, bank_info: [row] }).success).toBe(true)
    expect(manualSchema.safeParse({ ...base, type: 'check_payment' }).success).toBe(true)
    expect(manualSchema.safeParse({ ...base, type: 'check_payment', heading: ' ' }).success).toBe(false)
    expect(manualSchema.safeParse({ ...base, bank_info: [{ ...row, account_number: '' }] }).success).toBe(false)
  })

  it('payout methods need a logo; recharge amounts must be positive (AEC accepted negatives)', () => {
    expect(payoutSchema.safeParse({ type: 'others', name: 'M10', logo: '' }).success).toBe(false)
    expect(payoutSchema.safeParse({ type: 'others', name: 'M10', logo: 'https://x/y.png' }).success).toBe(true)
    const recharge = { user_id: 1, amount: 10, trx_id: 'T1', photo: '' }
    expect(rechargeSchema.safeParse(recharge).success).toBe(true)
    expect(rechargeSchema.safeParse({ ...recharge, amount: -5 }).success).toBe(false)
    expect(rechargeSchema.safeParse({ ...recharge, amount: 0 }).success).toBe(false)
    expect(rechargeSchema.safeParse({ ...recharge, trx_id: '' }).success).toBe(false)
    expect(rechargeSchema.safeParse({ ...recharge, user_id: undefined }).success).toBe(false)
  })

  it('Payriff needs the credentials of the chosen mode', () => {
    const base = {
      display_name: '', mode: 'production', test_merchant_id: 'ES1', test_secret_key: 's',
      production_merchant_id: '', production_secret_key: '',
    }
    expect(payriffSchema.safeParse(base).success).toBe(false)
    expect(payriffSchema.safeParse({ ...base, mode: 'test' }).success).toBe(true)
    expect(payriffSchema.safeParse({ ...base, production_merchant_id: 'ES2', production_secret_key: 'k' }).success).toBe(true)
  })

  it('Payriff secrets are masked, kept when the mask comes back and replaced otherwise', () => {
    const stored: PayriffSettings = {
      active: true, display_name: '', mode: 'test', test_merchant_id: 'ES1', test_secret_key: 'real',
      production_merchant_id: '', production_secret_key: '',
    }
    const masked = maskPayriff(stored)
    expect(masked.test_secret_key).toBe(SECRET_MASK)
    expect(masked.production_secret_key).toBe('')
    const { active: _a, ...incoming } = masked
    expect(mergePayriff(stored, incoming).test_secret_key).toBe('real')
    expect(mergePayriff(stored, { ...incoming, test_secret_key: 'new' }).test_secret_key).toBe('new')
    expect(isPayriffConfigured(stored)).toBe(true)
    expect(isPayriffConfigured({ ...stored, mode: 'production' })).toBe(false)
  })
})

describe('payments mock reads and writes', () => {
  it('manual methods: `{data, meta}`, create / update / delete are visible on the next read', () => {
    const page = get('/manual-methods')
    expect(page.meta!.total).toBe(6)
    expect(get('/manual-methods', { q: 'birbank' }).data).toHaveLength(1)

    write('POST', '/manual-methods', { type: 'check_payment', heading: 'Brand new', description: '', photo: null, bank_info: [] })
    expect(get('/manual-methods').data[0]).toMatchObject({ heading: 'Brand new', type: 'check_payment' })
    const id = String(get('/manual-methods').data[0].id)
    write('PUT', '/manual-methods/:id', { heading: 'Renamed' }, [id])
    expect(get('/manual-methods', { q: 'Renamed' }).data).toHaveLength(1)
    write('DELETE', '/manual-methods/:id', undefined, [id])
    expect(get('/manual-methods', { q: 'Renamed' }).data).toHaveLength(0)
  })

  it('offline orders: payment-status tab is a server filter, sort works', () => {
    expect(get('/offline-orders').meta!.total).toBe(24)
    const paid = get('/offline-orders', { tab: 'paid', ...all }).data
    expect(paid.length).toBeGreaterThan(0)
    expect(paid.every((r) => r.payment_status === 'paid')).toBe(true)
    const sorted = get('/offline-orders', { sort: '-amount', ...all }).data.map((r) => Number(r.amount))
    expect(sorted).toEqual([...sorted].sort((a, b) => b - a))
  })

  it('wallet requests: tabs filter on the server and approval never credits twice', () => {
    const everything = get('/wallet-requests', all).data
    const pending = get('/wallet-requests', { tab: 'pending', ...all }).data
    expect(pending.length).toBeGreaterThan(0)
    expect(pending.every((r) => r.approved === false)).toBe(true)
    expect(get('/wallet-requests', { tab: 'by_admin', ...all }).data.every((r) => r.added_by === 'admin')).toBe(true)
    expect(get('/wallet-requests', { tab: 'by_customer', ...all }).data.every((r) => r.added_by === 'customer')).toBe(true)

    const ids = pending.slice(0, 2).map((r) => Number(r.id))
    write('POST', '/wallet-requests/approve', { ids })
    write('POST', '/wallet-requests/approve', { ids }) // second time is a no-op
    expect(get('/wallet-requests', { tab: 'pending', ...all }).data).toHaveLength(pending.length - 2)
    expect(get('/wallet-requests', all).data).toHaveLength(everything.length)
  })

  it('admin recharge adds an approved row; customers are searched on the server', () => {
    expect(get('/customers', { q: 'zzzz' }).data).toHaveLength(0)
    const customer = get('/customers', { q: 'Aysel' }).data[0]
    expect(customer).toHaveProperty('email')
    write('POST', '/wallet-recharges', { user_id: customer.id, amount: 25, trx_id: 'ADM-1', photo: '' })
    expect(get('/wallet-requests', { q: 'ADM-1' }).data[0]).toMatchObject({ approved: true, added_by: 'admin', amount: 25 })
    // a non-positive amount is refused
    const refused = write('POST', '/wallet-recharges', { user_id: customer.id, amount: -3, trx_id: 'ADM-2', photo: '' })
    expect(refused.message).toBe('invalid')
    expect(get('/wallet-requests', { q: 'ADM-2' }).data).toHaveLength(0)
  })

  it('package requests: seller and customer lists approve one way', () => {
    for (const kind of ['seller', 'customer']) {
      const path = `/${kind}-package-requests`
      const open = get(path, all).data.find((r) => r.approved === false)!
      write('POST', `${path}/:id/approve`, undefined, [String(open.id)])
      expect(get(path, all).data.find((r) => r.id === open.id)!.approved).toBe(true)
    }
    expect(get('/seller-package-requests', all).data.some((r) => r.package === null)).toBe(true)
  })

  it('payout methods: create, update, delete and bulk delete', () => {
    const before = get('/payout-methods').meta!.total
    write('POST', '/payout-methods', { type: 'others', name: 'Zeta Pay', logo: 'https://x/y.png' })
    expect(get('/payout-methods').meta!.total).toBe(before + 1)
    const id = String(get('/payout-methods', { q: 'Zeta' }).data[0].id)
    write('PUT', '/payout-methods/:id', { name: 'Zeta Pay 2' }, [id])
    expect(get('/payout-methods', { q: 'Zeta Pay 2' }).data).toHaveLength(1)
    write('DELETE', '/payout-methods/:id', undefined, [id])
    const ids = get('/payout-methods', all).data.slice(0, 3).map((r) => Number(r.id))
    write('POST', '/payout-methods/bulk-delete', { ids })
    expect(get('/payout-methods').meta!.total).toBe(before - 3)
  })

  it('Payriff: secrets never leave the server, the mask keeps them, an unconfigured mode cannot be active', () => {
    const first = get('/payriff').data as unknown as PayriffSettings
    expect(first.test_secret_key).toBe(SECRET_MASK)
    const { active: _a, ...form } = first
    write('PUT', '/payriff', { ...form, display_name: 'Card' })
    expect(get('/payriff').data).toMatchObject({ display_name: 'Card', test_secret_key: SECRET_MASK, active: true })

    write('PUT', '/payriff', { ...form, mode: 'production' })
    expect(get('/payriff').data).toMatchObject({ mode: 'production', active: false })
    write('PUT', '/payriff/activation', { active: true })
    expect(get('/payriff').data).toMatchObject({ active: false })

    write('PUT', '/payriff', { ...form, mode: 'production', production_merchant_id: 'ES9', production_secret_key: 'live' })
    write('PUT', '/payriff/activation', { active: true })
    expect(get('/payriff').data).toMatchObject({ active: true, production_secret_key: SECRET_MASK })
  })
})
