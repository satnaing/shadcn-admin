import { mockRoutes } from '@/mocks'
import { mockPermissionsForRole } from '@/mocks/auth'
import { menuFor } from '@/mocks/menu.routes'
import { mockModules } from '@/mocks/modules.data'
import { ALL_PERMISSIONS, PERMISSIONS } from '@/shared/permissions'
import { describe, expect, it } from 'vitest'
import { isModuleEnabled } from '@/hooks/use-module-enabled'
import { posManifest, posPermissions } from './module.manifest'

type Row = Record<string, string | number | boolean | null | object>
type Body = { data: Row[] & Row; meta?: { total: number; last_page: number } }
const P = '/admin/pos'
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
) => mockRoutes[`${method} ${P}${path}`]({ params, query: {}, body }) as Body
const all = { per_page: '1000' }

const files = import.meta.glob<string>('/public/locales/*/*.json', {
  query: '?raw',
  import: 'default',
  eager: true,
})
const locale = (lang: string, ns = 'pos') =>
  JSON.parse(files[`/public/locales/${lang}/${ns}.json`]) as Record<
    string,
    unknown
  >
const keys = (o: unknown, prefix = ''): string[] =>
  Object.entries(o as Record<string, unknown>).flatMap(([k, v]) =>
    v && typeof v === 'object' ? keys(v, `${prefix}${k}.`) : [`${prefix}${k}`]
  )

describe('pos manifest', () => {
  it('declares exactly the permissions of the single tree group', () => {
    expect([...posPermissions].sort()).toEqual(
      Object.values(PERMISSIONS.POS).sort()
    )
    expect(new Set(ALL_PERMISSIONS).size).toBe(ALL_PERMISSIONS.length)
    expect(posPermissions.some((p) => p.endsWith('_own'))).toBe(false)
  })

  it('menu items live under /admin/pos and use declared permissions + nav keys in every language', () => {
    const { items, group } = posManifest.admin_menu!
    const navs = ['en', 'az', 'tr', 'ru'].map(
      (l) => locale(l, 'nav') as Record<string, string>
    )
    for (const item of items) {
      expect(item.route.startsWith(P)).toBe(true)
      expect(posPermissions).toContain(item.permission)
      for (const nav of navs) expect(nav[item.key], item.key).toBeTruthy()
    }
    for (const nav of navs) expect(nav[group.key]).toBeTruthy()
  })

  it('sidebar group disappears when the module is disabled', () => {
    const module = mockModules.find((m) => m.id === 'pos')!
    expect(menuFor('admin').some((g) => g.module === 'pos')).toBe(true)
    module.enabled = false
    expect(menuFor('admin').some((g) => g.module === 'pos')).toBe(false)
    module.enabled = true
  })

  it('route guard rule: disabled or missing module is not enabled', () => {
    const rows = [{ id: 'pos', enabled: false, installed: true }]
    expect(isModuleEnabled(rows, 'pos')).toBe(false)
    expect(isModuleEnabled([{ ...rows[0], enabled: true }], 'pos')).toBe(true)
  })

  it('a seller sees the terminal but cannot switch POS on for sellers', () => {
    const seller = mockPermissionsForRole('seller')
    expect(seller).toContain('pos.index')
    expect(seller).toContain('pos.config_manage')
    expect(seller).not.toContain('pos.activation_manage')
    expect(mockPermissionsForRole('admin')).toContain('pos.activation_manage')
  })

  it('has identical locale keys in az/en/tr/ru and every role group label', () => {
    const en = keys(locale('en')).sort()
    for (const l of ['az', 'tr', 'ru'])
      expect(keys(locale(l)).sort()).toEqual(en)
    for (const l of ['en', 'az', 'tr', 'ru'])
      expect(
        (locale(l, 'roles').groups as Record<string, string>).pos
      ).toBeTruthy()
  })
})

describe('pos mock terminal catalogue', () => {
  it('stock: `{data, meta}`, 16 cards per page, only products switched on for POS', () => {
    const page = get('/stock')
    expect(page.data).toHaveLength(16)
    expect(page.meta!.last_page).toBeGreaterThan(1)
    const everything = get('/stock', all).data
    const onPos = get('/products', all).data.map((p) => p.id)
    expect(
      everything.every((s) => onPos.includes(s.product_id as number))
    ).toBe(true)
  })

  it('filters by category (including sub-categories), brand and name', () => {
    const electronics = get('/stock', { category: '1', ...all }).data
    const phones = get('/stock', { category: '2', ...all }).data
    expect(electronics.length).toBeGreaterThan(phones.length)
    expect(phones.length).toBeGreaterThan(0)
    expect(
      get('/stock', { q: 'earbuds', ...all }).data.every((s) =>
        String(s.name).toLowerCase().includes('earbuds')
      )
    ).toBe(true)
    expect(
      get('/stock', { brand: '1', ...all }).data.every((s) => s.brand_id === 1)
    ).toBe(true)
  })

  it('a barcode search never leaks a product that is not on the terminal (AEC OR bug)', () => {
    const offTerminal = get('/products/available', all).data[0]
    expect(offTerminal).toBeTruthy()
    const barcode = `869000000${100 + (offTerminal.id as number) - 1}`
    expect(get('/stock', { q: barcode, ...all }).data).toHaveLength(0)
  })
})

describe('pos mock writes are visible on the next read', () => {
  it('importing and removing products moves them between the lists', () => {
    const candidate = get('/products/available', all).data[0].id as number
    write('PUT', '/products', { ids: [candidate], pos: true })
    expect(get('/products', all).data.some((p) => p.id === candidate)).toBe(
      true
    )
    expect(
      get('/products/available', all).data.some((p) => p.id === candidate)
    ).toBe(false)
    expect(
      get('/stock', all).data.some((s) => s.product_id === candidate)
    ).toBe(true)
    write('PUT', '/products', { ids: [candidate], pos: false })
    expect(
      get('/stock', all).data.some((s) => s.product_id === candidate)
    ).toBe(false)
  })

  it('placing an order takes stock, lists the order first and applies the capped discount', () => {
    const item = get('/stock', all).data.find(
      (s) => !s.digital && (s.stock_qty as number) >= 3
    )!
    const before = get('/orders', all).meta!.total
    const res = write('POST', '/orders', {
      order_source: 'facebook',
      customer_id: null,
      address_id: null,
      guest: { name: 'Mina', phone: '5', email: '', address: 'x' },
      items: [{ stock_id: item.id, quantity: 2 }],
      shipping_cost: 0,
      discount: 100000,
      payment_type: 'cash_on_delivery',
      offline: null,
    })
    expect(res.data).toMatchObject({ grand_total: 0 })
    expect(
      get('/stock', all).data.find((s) => s.id === item.id)!.stock_qty
    ).toBe((item.stock_qty as number) - 2)
    const orders = get('/orders')
    expect(orders.meta!.total).toBe(before + 1)
    expect(get('/orders', { sort: '-date' }).data[0]).toMatchObject({
      customer: 'Mina',
      source: 'facebook',
      payment_status: 'unpaid',
    })
  })

  it('orders filter by payment status and search server-side', () => {
    const paid = get('/orders', { tab: 'paid', ...all }).data
    expect(paid.length).toBeGreaterThan(0)
    expect(paid.every((o) => o.payment_status === 'paid')).toBe(true)
    expect(
      get('/orders', { q: String(paid[0].code), ...all }).data.length
    ).toBeGreaterThan(0)
  })

  it('customer lookup needs 3 characters and a saved address can be added', () => {
    expect(get('/customers', { field: 'phone', q: '50' }).data).toHaveLength(0)
    const found = get('/customers', { field: 'email', q: 'rauf' }).data
    expect(found).toHaveLength(1)
    const id = String(found[0].id)
    const before = get('/customers/:id/addresses', {}, [id]).data.length
    write(
      'POST',
      '/customers/:id/addresses',
      {
        address: 'New st',
        country_id: 1,
        state_id: 1,
        city_id: 1,
        postal_code: '1',
        phone: '5',
      },
      [id]
    )
    const after = get('/customers/:id/addresses', {}, [id]).data
    expect(after).toHaveLength(before + 1)
    expect(after[after.length - 1]).toMatchObject({
      address: 'New st',
      city: 'Nəsimi',
    })
  })

  it('settings keep what was written', () => {
    write('PUT', '/settings', { print_width: 58 })
    write('PUT', '/settings', { seller_activation: false })
    expect(get('/settings').data).toMatchObject({
      print_width: 58,
      seller_activation: false,
    })
  })

  it('receipt returns a download link', () => {
    const id = String(get('/orders', all).data[0].id)
    expect(get('/orders/:id/receipt', {}, [id]).data).toHaveProperty('filename')
  })
})
