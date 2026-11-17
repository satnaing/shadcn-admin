import { mockRoutes } from '@/mocks'
import { menuFor } from '@/mocks/menu.routes'
import { mockModules } from '@/mocks/modules.data'
import { ALL_PERMISSIONS, PERMISSIONS } from '@/shared/permissions'
import { describe, expect, it } from 'vitest'
import { isModuleEnabled } from '@/hooks/use-module-enabled'
import {
  productDefaults,
  productSchema,
  type ProductFormValues,
} from './data/wholesale.schema'
import { wholesaleManifest, wholesalePermissions } from './module.manifest'

type Row = Record<string, string | number | boolean | null | object>
type Body = { data: Row[] & Row; meta?: { total: number } }
const P = '/admin/wholesale'
const get = (path: string, query: Record<string, string> = {}) =>
  mockRoutes[`GET ${P}${path}`]({ params: [], query }) as Body
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
const locale = (lang: string, ns = 'wholesale') =>
  JSON.parse(files[`/public/locales/${lang}/${ns}.json`]) as Record<
    string,
    unknown
  >
const keys = (o: unknown, prefix = ''): string[] =>
  Object.entries(o as Record<string, unknown>).flatMap(([k, v]) =>
    v && typeof v === 'object' ? keys(v, `${prefix}${k}.`) : [`${prefix}${k}`]
  )

describe('wholesale manifest', () => {
  it('declares exactly the permissions of the single tree group', () => {
    expect([...wholesalePermissions].sort()).toEqual(
      Object.values(PERMISSIONS.WHOLESALE).sort()
    )
    expect(new Set(ALL_PERMISSIONS).size).toBe(ALL_PERMISSIONS.length)
    expect(wholesalePermissions.some((p) => p.endsWith('_own'))).toBe(false)
  })

  it('menu items live under /admin/wholesale and use declared permissions + nav keys in every language', () => {
    const { items, group } = wholesaleManifest.admin_menu!
    const navs = ['en', 'az', 'tr', 'ru'].map(
      (l) => locale(l, 'nav') as Record<string, string>
    )
    for (const item of items) {
      expect(item.route.startsWith(P)).toBe(true)
      expect(wholesalePermissions).toContain(item.permission)
      for (const nav of navs) expect(nav[item.key], item.key).toBeTruthy()
    }
    for (const nav of navs) expect(nav[group.key]).toBeTruthy()
  })

  it('is registered once and the sidebar group disappears when disabled', () => {
    expect(mockModules.filter((m) => m.id === 'wholesale')).toHaveLength(1)
    const module = mockModules.find((m) => m.id === 'wholesale')!
    expect(menuFor('admin').some((g) => g.module === 'wholesale')).toBe(true)
    module.enabled = false
    expect(menuFor('admin').some((g) => g.module === 'wholesale')).toBe(false)
    module.enabled = true
  })

  it('route guard rule: disabled or missing module is not enabled', () => {
    const rows = [{ id: 'wholesale', enabled: false, installed: true }]
    expect(isModuleEnabled(rows, 'wholesale')).toBe(false)
    expect(isModuleEnabled([{ ...rows[0], enabled: true }], 'wholesale')).toBe(
      true
    )
  })

  it('has identical locale keys in az/en/tr/ru and every role group label', () => {
    const en = keys(locale('en')).sort()
    for (const l of ['az', 'tr', 'ru'])
      expect(keys(locale(l)).sort()).toEqual(en)
    for (const l of ['en', 'az', 'tr', 'ru'])
      expect(
        (locale(l, 'roles').groups as Record<string, string>).wholesale
      ).toBeTruthy()
  })
})

describe('wholesale mock', () => {
  it('lookups: categories, brands, units and the seller filter list', () => {
    const d = get('/lookups').data as unknown as Record<string, unknown[]>
    for (const k of ['categories', 'brands', 'units', 'sellers'])
      expect(d[k].length).toBeGreaterThan(0)
  })

  it('products: `{data, meta}`, 10+ rows, server-side q/page/sort, owner and seller filters', () => {
    expect(get('/products').meta?.total).toBeGreaterThanOrEqual(10)
    expect(get('/products', { page: '2', per_page: '5' }).data).toHaveLength(5)
    expect(get('/products', { q: 'bubble', ...all }).data).toHaveLength(1)
    const asc = get('/products', { sort: 'unit_price', ...all }).data
    expect(Number(asc[0].unit_price)).toBeLessThanOrEqual(
      Number(asc[1].unit_price)
    )

    const inhouse = get('/products', { owner: 'inhouse', ...all }).data
    expect(inhouse.length).toBeGreaterThan(0)
    expect(inhouse.every((p) => p.owner_type === 'admin')).toBe(true)
    const sellers = get('/products', { owner: 'seller', ...all }).data
    expect(sellers.every((p) => p.owner_type === 'seller')).toBe(true)
    expect(
      get('/products', {
        seller: String(sellers[0].owner_id),
        ...all,
      }).data.every((p) => p.owner_id === sellers[0].owner_id)
    ).toBe(true)
  })

  it('sort is whitelisted: an unknown column falls back to the default order', () => {
    const rows = get('/products', { sort: 'password', ...all }).data
    expect(rows).toHaveLength(get('/products', all).data.length)
  })

  it('create / update / flag / delete / bulk delete are visible on the next read', () => {
    const values: ProductFormValues = {
      ...productDefaults,
      name: 'Zip ties 300 mm (pack of 100)',
      unit_id: 4,
      unit_price: 8,
      current_stock: 500,
      tiers: [{ min_qty: 5, max_qty: 20, price: 7 }],
      category_ids: [2],
      category_id: 2,
    }
    const created = write('POST', '/products', values).data
    const read = () => get('/products', { q: 'zip ties', ...all }).data
    expect(read()).toHaveLength(1)
    expect(read()[0].tiers_count).toBe(1)

    write('PUT', '/products/:id', { ...values, unit_price: 9 }, [
      String(created.id),
    ])
    expect(read()[0].unit_price).toBe(9)
    const detail = mockRoutes[`GET ${P}/products/:id`]({
      params: [String(created.id)],
      query: {},
    }) as Body
    expect(detail.data.unit_price).toBe(9)
    expect((detail.data.tiers as unknown[]).length).toBe(1)

    write('PATCH', '/products/:id/flag', { flag: 'is_featured', value: true }, [
      String(created.id),
    ])
    expect(read()[0].is_featured).toBe(true)
    write(
      'PATCH',
      '/products/:id/flag',
      { flag: 'is_approved', value: false },
      [String(created.id)]
    )
    expect(read()[0].is_approved).toBe(false)

    write('DELETE', '/products/:id', undefined, [String(created.id)])
    expect(read()).toHaveLength(0)

    const [a, b] = get('/products', all).data
    const total = get('/products', all).meta!.total
    write('POST', '/products/delete', { ids: [a.id, b.id] })
    expect(get('/products', all).meta!.total).toBe(total - 2)
  })
})

describe('wholesale product schema fixes AEC gaps', () => {
  const ok: ProductFormValues = {
    ...productDefaults,
    name: 'Pens',
    unit_id: 1,
    unit_price: 10,
    tiers: [
      { min_qty: 5, max_qty: 9, price: 9 },
      { min_qty: 10, max_qty: 30, price: 8 },
    ],
    category_ids: [1, 2],
    category_id: 2,
  }
  const fails = (patch: Partial<ProductFormValues>) =>
    !productSchema.safeParse({ ...ok, ...patch }).success

  it('accepts a valid product', () => {
    expect(productSchema.safeParse(ok).success).toBe(true)
  })

  it('needs a unit id (AEC typed free text), a positive price and non-negative whole stock', () => {
    expect(fails({ unit_id: 0 })).toBe(true)
    expect(fails({ unit_price: 0 })).toBe(true)
    expect(fails({ current_stock: -1 })).toBe(true)
    expect(fails({ current_stock: 1.5 })).toBe(true)
    expect(fails({ min_qty: 0 })).toBe(true)
  })

  it('main category must be one of the selected categories', () => {
    expect(fails({ category_ids: [] })).toBe(true)
    expect(fails({ category_id: 5 })).toBe(true)
  })

  it('price bands: at least one, min ≤ max, no overlap, positive price', () => {
    expect(fails({ tiers: [] })).toBe(true)
    expect(fails({ tiers: [{ min_qty: 9, max_qty: 5, price: 1 }] })).toBe(true)
    expect(
      fails({
        tiers: [
          { min_qty: 5, max_qty: 10, price: 9 },
          { min_qty: 10, max_qty: 20, price: 8 },
        ],
      })
    ).toBe(true)
    expect(fails({ tiers: [{ min_qty: 5, max_qty: 9, price: 0 }] })).toBe(true)
  })

  it('discount: percent ≤ 100, flat below the base price, end date not before start', () => {
    expect(fails({ discount_type: 'percent', discount: 101 })).toBe(true)
    expect(fails({ discount_type: 'flat', discount: 10 })).toBe(true)
    expect(fails({ discount_type: 'flat', discount: 3 })).toBe(false)
    expect(
      fails({
        discount_start: '2026-02-02T10:00',
        discount_end: '2026-02-01T10:00',
      })
    ).toBe(true)
  })
})
