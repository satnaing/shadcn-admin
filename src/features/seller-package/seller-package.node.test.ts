import { mockRoutes } from '@/mocks'
import { menuFor } from '@/mocks/menu.routes'
import { mockModules } from '@/mocks/modules.data'
import { ALL_PERMISSIONS, PERMISSIONS } from '@/shared/permissions'
import { describe, expect, it } from 'vitest'
import { isModuleEnabled } from '@/hooks/use-module-enabled'
import {
  packageDefaults,
  packageSchema,
  packageToForm,
} from './data/seller-package.schema'
import type { SellerPackage } from './data/seller-package.type'
import {
  sellerPackageManifest,
  sellerPackagePermissions,
} from './module.manifest'

type Body = { data: SellerPackage[] & SellerPackage }
const P = '/admin/seller-packages'
const get = () => mockRoutes[`GET ${P}`]({ params: [], query: {} }) as Body
const write = (
  method: string,
  path: string,
  body?: unknown,
  params: string[] = []
) => mockRoutes[`${method} ${P}${path}`]({ params, query: {}, body }) as Body

const files = import.meta.glob<string>('/public/locales/*/*.json', {
  query: '?raw',
  import: 'default',
  eager: true,
})
const locale = (lang: string, ns = 'seller_package') =>
  JSON.parse(files[`/public/locales/${lang}/${ns}.json`]) as Record<
    string,
    unknown
  >
const keys = (o: unknown, prefix = ''): string[] =>
  Object.entries(o as Record<string, unknown>).flatMap(([k, v]) =>
    v && typeof v === 'object' ? keys(v, `${prefix}${k}.`) : [`${prefix}${k}`]
  )

describe('seller-package manifest', () => {
  it('declares exactly the permissions of the single tree group', () => {
    expect([...sellerPackagePermissions].sort()).toEqual(
      Object.values(PERMISSIONS.SELLER_PACKAGE).sort()
    )
    expect(new Set(ALL_PERMISSIONS).size).toBe(ALL_PERMISSIONS.length)
    expect(sellerPackagePermissions.some((p) => p.endsWith('_own'))).toBe(false)
  })

  it('menu items live under /admin/seller-package, use declared permissions and nav keys in every language', () => {
    const { items, group } = sellerPackageManifest.admin_menu!
    const navs = ['en', 'az', 'tr', 'ru'].map(
      (l) => locale(l, 'nav') as Record<string, string>
    )
    for (const item of items) {
      expect(item.route.startsWith('/admin/seller-package')).toBe(true)
      expect(sellerPackagePermissions).toContain(item.permission)
      for (const nav of navs) expect(nav[item.key], item.key).toBeTruthy()
    }
    for (const nav of navs) expect(nav[group.key]).toBeTruthy()
  })

  it('is registered once and the sidebar group disappears when disabled', () => {
    expect(mockModules.filter((m) => m.id === 'seller-package')).toHaveLength(1)
    const module = mockModules.find((m) => m.id === 'seller-package')!
    expect(menuFor('admin').some((g) => g.module === 'seller-package')).toBe(
      true
    )
    module.enabled = false
    expect(menuFor('admin').some((g) => g.module === 'seller-package')).toBe(
      false
    )
    module.enabled = true
  })

  it('route guard rule: disabled or missing module is not enabled', () => {
    const rows = [{ id: 'seller-package', enabled: false, installed: true }]
    expect(isModuleEnabled(rows, 'seller-package')).toBe(false)
    expect(
      isModuleEnabled([{ ...rows[0], enabled: true }], 'seller-package')
    ).toBe(true)
  })

  it('has identical locale keys in az/en/tr/ru and every role group label', () => {
    const en = keys(locale('en')).sort()
    for (const l of ['az', 'tr', 'ru'])
      expect(keys(locale(l)).sort()).toEqual(en)
    for (const l of ['en', 'az', 'tr', 'ru'])
      expect(
        (locale(l, 'roles').groups as Record<string, string>).seller_package
      ).toBeTruthy()
  })
})

describe('seller-package mock', () => {
  it('lists unpaged cards with {data}; every package has the AEC core fields', () => {
    const list = get().data
    expect(list.length).toBeGreaterThanOrEqual(4)
    for (const p of list) {
      expect(p.name).toBe(p.translations.az)
      expect(p.duration).toBeGreaterThan(0)
      expect(p.logo).toBeTruthy()
    }
  })

  it('create / update / delete are visible on the next read; new package has no sellers', () => {
    const values = {
      ...packageDefaults,
      translations: { az: 'Yeni', en: 'New', tr: 'Yeni', ru: 'Новый' },
      amount: 15,
      logo: 'x',
    }
    const created = write('POST', '', values).data
    expect(get().data.find((p) => p.id === created.id)?.sellers_count).toBe(0)
    write('PUT', '/:id', { ...values, amount: 25 }, [String(created.id)])
    expect(get().data.find((p) => p.id === created.id)?.amount).toBe(25)
    write('DELETE', '/:id', undefined, [String(created.id)])
    expect(get().data.some((p) => p.id === created.id)).toBe(false)
  })
})

describe('seller-package schema fixes AEC gaps', () => {
  const ok = {
    ...packageDefaults,
    translations: { az: 'A', en: '', tr: '', ru: '' },
    logo: 'x',
  }

  it('accepts a valid package, requires default-language name and logo', () => {
    expect(packageSchema.safeParse(ok).success).toBe(true)
    expect(
      packageSchema.safeParse({
        ...ok,
        translations: { ...ok.translations, az: '' },
      }).success
    ).toBe(false)
    expect(packageSchema.safeParse({ ...ok, logo: '' }).success).toBe(false)
  })

  it('amount, uploads and days are real numbers: no negatives, counts whole, at least one day', () => {
    for (const bad of [
      { amount: -1 },
      { product_upload_limit: -1 },
      { product_upload_limit: 2.5 },
      { preorder_product_upload_limit: -3 },
      { duration: 0 },
      { duration: 1.5 },
    ])
      expect(packageSchema.safeParse({ ...ok, ...bad }).success).toBe(false)
  })

  it('extra limits allow -1 (unlimited) but nothing lower', () => {
    expect(
      packageSchema.safeParse({ ...ok, staff_limit: -1 }).success
    ).toBe(true)
    expect(
      packageSchema.safeParse({ ...ok, staff_limit: -2 }).success
    ).toBe(false)
  })

  it('edit form values drop id/name/sellers_count and round-trip through the schema', () => {
    const pack = get().data[2]
    const form = packageToForm(pack)
    expect(form).not.toHaveProperty('id')
    expect(form).not.toHaveProperty('sellers_count')
    expect(packageSchema.safeParse(form).success).toBe(true)
  })
})
