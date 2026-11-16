import { mockRoutes } from '@/mocks'
import { mockPermissionsForRole } from '@/mocks/auth'
import { menuFor } from '@/mocks/menu.routes'
import { mockModules } from '@/mocks/modules.data'
import { ALL_PERMISSIONS, PERMISSIONS } from '@/shared/permissions'
import { describe, expect, it } from 'vitest'
import { isModuleEnabled } from '@/hooks/use-module-enabled'
import { courierManifest, courierPermissions } from './module.manifest'

type Row = Record<string, string | number | boolean | null | object>
type Body = { data: Row[] & Row; meta?: { total: number } }
const P = '/admin/courier'
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
const couriers = () => get('/couriers', all).data
const byId = (id: unknown) => couriers().find((c) => c.id === id)!

const files = import.meta.glob<string>('/public/locales/*/*.json', {
  query: '?raw',
  import: 'default',
  eager: true,
})
const locale = (lang: string, ns = 'courier') =>
  JSON.parse(files[`/public/locales/${lang}/${ns}.json`]) as Record<
    string,
    unknown
  >
const keys = (o: unknown, prefix = ''): string[] =>
  Object.entries(o as Record<string, unknown>).flatMap(([k, v]) =>
    v && typeof v === 'object' ? keys(v, `${prefix}${k}.`) : [`${prefix}${k}`]
  )

describe('courier manifest', () => {
  it('declares exactly the permissions of the single tree group', () => {
    expect([...courierPermissions].sort()).toEqual(
      Object.values(PERMISSIONS.COURIER).sort()
    )
    expect(new Set(ALL_PERMISSIONS).size).toBe(ALL_PERMISSIONS.length)
    expect(courierPermissions.some((p) => p.endsWith('_own'))).toBe(false)
  })

  it('menu items live under /admin/courier and use declared permissions + nav keys in every language', () => {
    const { items, group } = courierManifest.admin_menu!
    const navs = ['en', 'az', 'tr', 'ru'].map(
      (l) => locale(l, 'nav') as Record<string, string>
    )
    for (const item of items) {
      expect(item.route.startsWith(P)).toBe(true)
      expect(courierPermissions).toContain(item.permission)
      for (const nav of navs) expect(nav[item.key], item.key).toBeTruthy()
    }
    for (const nav of navs) expect(nav[group.key]).toBeTruthy()
  })

  it('sidebar group disappears when the module is disabled', () => {
    const module = mockModules.find((m) => m.id === 'courier')!
    expect(menuFor('admin').some((g) => g.module === 'courier')).toBe(true)
    module.enabled = false
    expect(menuFor('admin').some((g) => g.module === 'courier')).toBe(false)
    module.enabled = true
  })

  it('route guard rule: disabled or missing module is not enabled', () => {
    const rows = [{ id: 'courier', enabled: false, installed: true }]
    expect(isModuleEnabled(rows, 'courier')).toBe(false)
    expect(isModuleEnabled([{ ...rows[0], enabled: true }], 'courier')).toBe(
      true
    )
  })

  it('the courier role sees only its own panel items; admin sees all', () => {
    const items = (role: string) =>
      menuFor(role)
        .filter((g) => g.module === 'courier')
        .flatMap((g) =>
          g.items
            .filter(
              (i) =>
                !i.permission ||
                mockPermissionsForRole(role).includes(i.permission)
            )
            .map((i) => i.key)
        )
    expect(items('admin')).toHaveLength(
      courierManifest.admin_menu!.items.length
    )
    expect(items('courier')).toEqual(
      expect.arrayContaining([
        'courierDeliveries',
        'courierCash',
        'courierEarnings',
      ])
    )
    expect(items('courier')).not.toContain('courierConfig')
    expect(items('courier')).not.toContain('courierList')
    expect(mockPermissionsForRole('courier')).not.toContain('courier.pay')
  })

  it('has identical locale keys in az/en/tr/ru and every role group label', () => {
    const en = keys(locale('en')).sort()
    for (const l of ['az', 'tr', 'ru'])
      expect(keys(locale(l)).sort()).toEqual(en)
    for (const l of ['en', 'az', 'tr', 'ru'])
      expect(
        (locale(l, 'roles').groups as Record<string, string>).courier
      ).toBeTruthy()
  })
})

describe('courier mock reads', () => {
  it('couriers: `{data, meta}`, server-side q/page/sort, no password in rows', () => {
    expect(get('/couriers').meta?.total).toBeGreaterThanOrEqual(10)
    expect(get('/couriers', { page: '2', per_page: '5' }).data).toHaveLength(5)
    const first = couriers()[0]
    expect(first).not.toHaveProperty('password')
    expect(
      get('/couriers', { q: String(first.email), ...all }).data.length
    ).toBeGreaterThan(0)
    const sorted = get('/couriers', { sort: 'name', ...all }).data.map((c) =>
      String(c.name)
    )
    expect(sorted).toEqual([...sorted].sort((a, b) => a.localeCompare(b)))
  })

  it('lists: payments, collections, cancel requests, ledgers', () => {
    for (const path of ['/payments', '/collections', '/cash', '/earnings'])
      expect(get(path).meta?.total, path).toBeGreaterThanOrEqual(10)
    const requests = get('/cancel-requests', all).data
    expect(requests.length).toBeGreaterThan(0)
    expect(requests[0]).toHaveProperty('order_code')
    // cash report holds only cash-on-delivery rows
    expect(
      get('/cash', all).data.every((r) => r.payment_type === 'cash_on_delivery')
    ).toBe(true)
  })

  it('deliveries: AEC stages filter on the server', () => {
    const stage = (tab: string) => get('/deliveries', { tab, ...all }).data
    expect(stage('on_the_way').length).toBeGreaterThan(0)
    expect(
      stage('on_the_way').every((d) => d.delivery_status === 'on_the_way')
    ).toBe(true)
    expect(
      stage('completed').every((d) => d.delivery_status === 'delivered')
    ).toBe(true)
    expect(
      stage('cancelled').every((d) => d.delivery_status === 'cancelled')
    ).toBe(true)
    expect(
      stage('assigned').every(
        (d) =>
          ['pending', 'confirmed'].includes(String(d.delivery_status)) &&
          !d.cancel_request
      )
    ).toBe(true)
    expect(stage('pending').every((d) => !d.cancel_request)).toBe(true)
    expect(get('/deliveries', all).data.length).toBeGreaterThan(
      stage('pending').length
    )
  })

  it('lookups carry the country → state → city tree', () => {
    const { countries, states, cities } = get('/lookups').data as unknown as {
      countries: Row[]
      states: Row[]
      cities: Row[]
    }
    expect(countries.length).toBeGreaterThan(0)
    expect(
      states.every((s) => countries.some((c) => c.id === s.parent_id))
    ).toBe(true)
    expect(cities.every((c) => states.some((s) => s.id === c.parent_id))).toBe(
      true
    )
  })
})

describe('courier writes are visible on the next read', () => {
  const values = {
    name: 'Test Kuryer',
    email: 'test@kuryer.test',
    phone: '+994501112233',
    password: 'abcdef',
    country_id: 1,
    state_id: 1,
    city_id: 1,
    avatar: null,
    address: 'Test',
  }

  it('create appears first; edit changes it; blank password keeps the old one', () => {
    const before = couriers().length
    write('POST', '/couriers', values)
    expect(couriers()).toHaveLength(before + 1)
    const created = couriers().find((c) => c.email === values.email)!
    write(
      'PUT',
      '/couriers/:id',
      { ...values, name: 'Renamed', password: '' },
      [String(created.id)]
    )
    const detail = get('/couriers/:id', {}, [String(created.id)]).data
    expect(detail.name).toBe('Renamed')
    expect(detail).not.toHaveProperty('password')
    expect(detail.country_id).toBe(1)
  })

  it('ban toggle', () => {
    const c = couriers()[0]
    write('PUT', '/couriers/:id/ban', { banned: true }, [String(c.id)])
    expect(byId(c.id).banned).toBe(true)
    write('PUT', '/couriers/:id/ban', { banned: false }, [String(c.id)])
    expect(byId(c.id).banned).toBe(false)
  })

  it('collect lowers the held cash and logs a collection; pay lowers earnings and logs a payment', () => {
    const c = couriers().find(
      (x) => Number(x.total_collection) > 50 && Number(x.total_earning) > 20
    )!
    const collections = get('/collections').meta!.total
    write('POST', '/couriers/:id/collect', { amount: 50 }, [String(c.id)])
    expect(byId(c.id).total_collection).toBe(Number(c.total_collection) - 50)
    expect(get('/collections').meta?.total).toBe(collections + 1)
    expect(get('/collections', { sort: '-created_at' }).data[0].amount).toBe(50)

    const payments = get('/payments').meta!.total
    write('POST', '/couriers/:id/pay', { amount: 20 }, [String(c.id)])
    expect(byId(c.id).total_earning).toBe(Number(c.total_earning) - 20)
    expect(get('/payments').meta?.total).toBe(payments + 1)
  })

  it('an amount above the balance is ignored (AEC refused it only after the click)', () => {
    const c = couriers()[2]
    write('POST', '/couriers/:id/collect', { amount: 999999 }, [String(c.id)])
    expect(byId(c.id).total_collection).toBe(c.total_collection)
  })

  it('cancel request moves the order into the admin cancel-request list', () => {
    const open = get('/deliveries', { tab: 'assigned', ...all }).data[0]
    const before = get('/cancel-requests').meta!.total
    write('POST', '/deliveries/:id/cancel-request', undefined, [
      String(open.id),
    ])
    expect(get('/cancel-requests').meta?.total).toBe(before + 1)
    expect(
      get('/deliveries', { tab: 'assigned', ...all }).data.some(
        (d) => d.id === open.id
      )
    ).toBe(false)
  })

  it('settings update partially and round-trip', () => {
    write('PUT', '/settings', { payment_type: 'salary', salary: 900 })
    write('PUT', '/settings', { otp_notification: true })
    const s = get('/settings').data as unknown as Row
    expect(s).toMatchObject({
      payment_type: 'salary',
      salary: 900,
      otp_notification: true,
    })
    expect(s.commission).toBeGreaterThan(0)
  })
})
