import { mockRoutes } from '@/mocks'
import { menuFor } from '@/mocks/menu.routes'
import { mockModules } from '@/mocks/modules.data'
import { ALL_PERMISSIONS, PERMISSIONS } from '@/shared/permissions'
import { describe, expect, it } from 'vitest'
import { isModuleEnabled } from '@/hooks/use-module-enabled'
import { packageSchema } from './data/classified.schema'
import { classifiedManifest, classifiedPermissions } from './module.manifest'

type Row = Record<string, string | number | boolean | null | object>
type Body = { data: Row[] & Row; meta?: { total: number } }
const P = '/admin/classified'
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
const locale = (lang: string, ns = 'classified') =>
  JSON.parse(files[`/public/locales/${lang}/${ns}.json`]) as Record<
    string,
    unknown
  >
const keys = (o: unknown, prefix = ''): string[] =>
  Object.entries(o as Record<string, unknown>).flatMap(([k, v]) =>
    v && typeof v === 'object' ? keys(v, `${prefix}${k}.`) : [`${prefix}${k}`]
  )

describe('classified manifest', () => {
  it('declares exactly the permissions of the single tree group', () => {
    expect([...classifiedPermissions].sort()).toEqual(
      Object.values(PERMISSIONS.CLASSIFIED).sort()
    )
    expect(new Set(ALL_PERMISSIONS).size).toBe(ALL_PERMISSIONS.length)
    expect(classifiedPermissions.some((p) => p.endsWith('_own'))).toBe(false)
  })

  it('menu items live under /admin/classified and use declared permissions + nav keys in every language', () => {
    const { items, group } = classifiedManifest.admin_menu!
    const navs = ['en', 'az', 'tr', 'ru'].map(
      (l) => locale(l, 'nav') as Record<string, string>
    )
    for (const item of items) {
      expect(item.route.startsWith(P)).toBe(true)
      expect(classifiedPermissions).toContain(item.permission)
      for (const nav of navs) expect(nav[item.key], item.key).toBeTruthy()
    }
    for (const nav of navs) expect(nav[group.key]).toBeTruthy()
  })

  it('is registered once and the sidebar group disappears when disabled', () => {
    expect(mockModules.filter((m) => m.id === 'classified')).toHaveLength(1)
    const module = mockModules.find((m) => m.id === 'classified')!
    expect(menuFor('admin').some((g) => g.module === 'classified')).toBe(true)
    module.enabled = false
    expect(menuFor('admin').some((g) => g.module === 'classified')).toBe(false)
    module.enabled = true
  })

  it('route guard rule: disabled or missing module is not enabled', () => {
    const rows = [{ id: 'classified', enabled: false, installed: true }]
    expect(isModuleEnabled(rows, 'classified')).toBe(false)
    expect(isModuleEnabled([{ ...rows[0], enabled: true }], 'classified')).toBe(
      true
    )
  })

  it('has identical locale keys in az/en/tr/ru and every role group label', () => {
    const en = keys(locale('en')).sort()
    for (const l of ['az', 'tr', 'ru'])
      expect(keys(locale(l)).sort()).toEqual(en)
    for (const l of ['en', 'az', 'tr', 'ru'])
      expect(
        (locale(l, 'roles').groups as Record<string, string>).classified
      ).toBeTruthy()
  })
})

describe('classified mock', () => {
  it('products: `{data, meta}`, 10+ rows, server-side q/page/sort', () => {
    expect(get('/products').meta?.total).toBeGreaterThanOrEqual(10)
    expect(get('/products', { page: '2', per_page: '5' }).data).toHaveLength(5)
    expect(get('/products', { q: 'iphone', ...all }).data).toHaveLength(1)
    const desc = get('/products', { sort: '-name', ...all }).data
    expect(String(desc[0].name) >= String(desc[1].name)).toBe(true)
  })

  it('publish switch, single delete and bulk delete are visible on the next read', () => {
    const [a, b, c] = get('/products', all).data
    write('PATCH', '/products/:id', { is_published: !a.is_published }, [
      String(a.id),
    ])
    expect(
      get('/products', all).data.find((x) => x.id === a.id)?.is_published
    ).toBe(!a.is_published)

    const total = get('/products', all).meta!.total
    write('DELETE', '/products/:id', undefined, [String(b.id)])
    expect(get('/products', all).meta!.total).toBe(total - 1)
    write('POST', '/products/delete', { ids: [c.id] })
    expect(get('/products', all).data.some((x) => x.id === c.id)).toBe(false)
  })

  it('packages: unpaged cards with one free package; create/update/delete round-trip', () => {
    const list = () => get('/packages').data
    expect(list().filter((p) => p.amount === 0)).toHaveLength(1)

    const values = {
      translations: { az: 'Biznes', en: 'Business', tr: 'İş', ru: 'Бизнес' },
      amount: 99,
      product_upload: 250,
      logo: 'x',
    }
    const created = write('POST', '/packages', values).data
    expect(list().find((p) => p.id === created.id)?.name).toBe('Biznes')
    write('PUT', '/packages/:id', { ...values, amount: 120 }, [
      String(created.id),
    ])
    expect(list().find((p) => p.id === created.id)?.amount).toBe(120)
    write('DELETE', '/packages/:id', undefined, [String(created.id)])
    expect(list().some((p) => p.id === created.id)).toBe(false)
  })
})

describe('classified package schema fixes AEC gaps', () => {
  const ok = {
    translations: { az: 'A', en: '', tr: '', ru: '' },
    amount: 0,
    product_upload: 5,
    logo: 'x',
  }

  it('accepts a valid package, requires the default-language name and a logo', () => {
    expect(packageSchema.safeParse(ok).success).toBe(true)
    expect(
      packageSchema.safeParse({
        ...ok,
        translations: { ...ok.translations, az: '' },
      }).success
    ).toBe(false)
    expect(packageSchema.safeParse({ ...ok, logo: '' }).success).toBe(false)
  })

  it('amount and uploads cannot be negative; uploads are whole numbers', () => {
    expect(packageSchema.safeParse({ ...ok, amount: -1 }).success).toBe(false)
    expect(packageSchema.safeParse({ ...ok, product_upload: -1 }).success).toBe(
      false
    )
    expect(
      packageSchema.safeParse({ ...ok, product_upload: 2.5 }).success
    ).toBe(false)
  })
})
