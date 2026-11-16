import { mockRoutes } from '@/mocks'
import { menuFor } from '@/mocks/menu.routes'
import { mockModules } from '@/mocks/modules.data'
import { ALL_PERMISSIONS, PERMISSIONS } from '@/shared/permissions'
import { describe, expect, it } from 'vitest'
import { isModuleEnabled } from '@/hooks/use-module-enabled'
import {
  allProductsSchema,
  productPointSchema,
  rangeSchema,
  settingsSchema,
} from './data/club-point.schema'
import { clubPointManifest, clubPointPermissions } from './module.manifest'

type Row = Record<string, string | number | boolean | null | object>
type Body = {
  data: Row[] & Row & { lines?: Row[]; updated?: number }
  meta?: { total: number }
}
const P = '/admin/club-point'
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
const locale = (lang: string, ns = 'club_point') =>
  JSON.parse(files[`/public/locales/${lang}/${ns}.json`]) as Record<
    string,
    unknown
  >
const keys = (o: unknown, prefix = ''): string[] =>
  Object.entries(o as Record<string, unknown>).flatMap(([k, v]) =>
    v && typeof v === 'object' ? keys(v, `${prefix}${k}.`) : [`${prefix}${k}`]
  )

describe('club-point manifest', () => {
  it('declares exactly the permissions of the single tree group', () => {
    expect([...clubPointPermissions].sort()).toEqual(
      Object.values(PERMISSIONS.CLUB_POINT).sort()
    )
    expect(new Set(ALL_PERMISSIONS).size).toBe(ALL_PERMISSIONS.length)
    expect(clubPointPermissions.some((p) => p.endsWith('_own'))).toBe(false)
  })

  it('menu items live under /admin/club-point and use declared permissions + nav keys in every language', () => {
    const { items, group } = clubPointManifest.admin_menu!
    const navs = ['en', 'az', 'tr', 'ru'].map(
      (l) => locale(l, 'nav') as Record<string, string>
    )
    for (const item of items) {
      expect(item.route.startsWith(P)).toBe(true)
      expect(clubPointPermissions).toContain(item.permission)
      for (const nav of navs) expect(nav[item.key], item.key).toBeTruthy()
    }
    for (const nav of navs) expect(nav[group.key]).toBeTruthy()
  })

  it('sidebar group disappears when the module is disabled', () => {
    const module = mockModules.find((m) => m.id === 'club-point')!
    expect(menuFor('admin').some((g) => g.module === 'club-point')).toBe(true)
    module.enabled = false
    expect(menuFor('admin').some((g) => g.module === 'club-point')).toBe(false)
    module.enabled = true
  })

  it('route guard rule: disabled or missing module is not enabled', () => {
    const rows = [{ id: 'club-point', enabled: false, installed: true }]
    expect(isModuleEnabled(rows, 'club-point')).toBe(false)
    expect(isModuleEnabled([{ ...rows[0], enabled: true }], 'club-point')).toBe(
      true
    )
  })

  it('has identical locale keys in az/en/tr/ru and every role group label', () => {
    const en = keys(locale('en')).sort()
    for (const l of ['az', 'tr', 'ru'])
      expect(keys(locale(l)).sort()).toEqual(en)
    for (const l of ['en', 'az', 'tr', 'ru'])
      expect(
        (locale(l, 'roles').groups as Record<string, string>).club_point
      ).toBeTruthy()
  })
})

describe('club-point mock reads', () => {
  it('earnings: `{data, meta}`, server-side q/page/tab, rows carry no lines', () => {
    expect(get('/earnings').meta?.total).toBeGreaterThanOrEqual(10)
    expect(get('/earnings', { page: '2', per_page: '5' }).data).toHaveLength(5)
    const first = get('/earnings', all).data[0]
    expect(first).not.toHaveProperty('lines')
    expect(
      get('/earnings', { q: String(first.order_code), ...all }).data.length
    ).toBeGreaterThan(0)
    const pending = get('/earnings', { tab: 'pending', ...all }).data
    expect(pending.length).toBeGreaterThan(0)
    expect(pending.every((e) => e.convert_status === 'pending')).toBe(true)
    expect(
      get('/earnings', { tab: 'converted', ...all }).data.every(
        (e) => e.convert_status === 'converted'
      )
    ).toBe(true)
  })

  it('earnings: detail lines add up to the order points; AEC "not found" cases exist', () => {
    const rows = get('/earnings', all).data
    const detail = get('/earnings/:id', {}, [String(rows[0].id)]).data
    expect(detail.lines!.reduce((s, l) => s + Number(l.points), 0)).toBe(
      detail.points
    )
    expect(rows.some((e) => e.order_code === null)).toBe(true)
    expect(rows.some((e) => e.customer_name === null)).toBe(true)
  })

  it('products: paged and searchable on the server', () => {
    expect(get('/products').meta?.total).toBeGreaterThanOrEqual(10)
    expect(get('/products', { q: 'iphone', ...all }).data).toHaveLength(1)
  })
})

describe('club-point writes are visible on the next read', () => {
  it('single product point', () => {
    const p = get('/products', all).data[0]
    write('PUT', '/products/:id', { point: 77 }, [String(p.id)])
    expect(
      get('/products', all).data.find((x) => x.id === p.id)?.earn_point
    ).toBe(77)
  })

  it('range sets a flat point only inside the price range and reports the count', () => {
    const before = get('/products', all).data
    const inside = before.filter(
      (p) => Number(p.unit_price) >= 100 && Number(p.unit_price) <= 300
    )
    const res = write('POST', '/products/range', {
      point: 5,
      min_price: 100,
      max_price: 300,
    })
    expect(res.data.updated).toBe(inside.length)
    for (const p of get('/products', all).data) {
      const hit = Number(p.unit_price) >= 100 && Number(p.unit_price) <= 300
      const was = before.find((b) => b.id === p.id)?.earn_point
      expect(p.earn_point).toBe(hit ? 5 : was)
    }
  })

  it('all products: points = price × multiplier', () => {
    write('POST', '/products/all', { point: 0.5 })
    for (const p of get('/products', all).data)
      expect(p.earn_point).toBe(
        Math.round(Number(p.unit_price) * 0.5 * 100) / 100
      )
  })

  it('convert rate setting round-trips', () => {
    write('PUT', '/settings', { convert_rate: 250 })
    expect(get('/settings').data.convert_rate).toBe(250)
  })
})

describe('club-point schemas fix AEC gaps', () => {
  it('convert rate must be above zero (AEC allowed 0 and divided by it)', () => {
    expect(settingsSchema.safeParse({ convert_rate: 0 }).success).toBe(false)
    expect(settingsSchema.safeParse({ convert_rate: 100 }).success).toBe(true)
  })

  it('range: min must not exceed max, points not negative', () => {
    expect(
      rangeSchema.safeParse({ point: 1, min_price: 50, max_price: 10 }).success
    ).toBe(false)
    expect(
      rangeSchema.safeParse({ point: 1, min_price: 10, max_price: 50 }).success
    ).toBe(true)
    expect(
      rangeSchema.safeParse({ point: -1, min_price: 10, max_price: 50 }).success
    ).toBe(false)
  })

  it('product and all-products points cannot be negative', () => {
    expect(productPointSchema.safeParse({ point: -1 }).success).toBe(false)
    expect(allProductsSchema.safeParse({ point: -0.5 }).success).toBe(false)
    expect(allProductsSchema.safeParse({ point: 0.5 }).success).toBe(true)
  })
})
