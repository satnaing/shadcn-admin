import { menuFor } from '@/mocks/menu.routes'
import { mockModules } from '@/mocks/modules.data'
import { ALL_PERMISSIONS, PERMISSIONS } from '@/shared/permissions'
import { describe, expect, it } from 'vitest'
import { isModuleEnabled } from '@/hooks/use-module-enabled'
import { canSetStep, currentStep } from './data/preorder.helpers'
import { productDefaults, productSchema } from './data/preorder.schema'
import { preorderManifest, preorderPermissions } from './module.manifest'

const P = '/admin/preorder'
const files = import.meta.glob<string>('/public/locales/*/*.json', {
  query: '?raw',
  import: 'default',
  eager: true,
})
const locale = (lang: string, ns = 'preorder') =>
  JSON.parse(files[`/public/locales/${lang}/${ns}.json`]) as Record<
    string,
    unknown
  >
const keys = (o: unknown, prefix = ''): string[] =>
  Object.entries(o as Record<string, unknown>).flatMap(([k, v]) =>
    v && typeof v === 'object' ? keys(v, `${prefix}${k}.`) : [`${prefix}${k}`]
  )

describe('preorder manifest', () => {
  it('declares exactly the permissions of the single tree group', () => {
    expect([...preorderPermissions].sort()).toEqual(
      Object.values(PERMISSIONS.PREORDER).sort()
    )
    expect(new Set(ALL_PERMISSIONS).size).toBe(ALL_PERMISSIONS.length)
    expect(preorderPermissions.some((p) => p.endsWith('_own'))).toBe(false)
  })

  it('menu items live under /admin/preorder and use declared permissions + nav keys in every language', () => {
    const { items, group } = preorderManifest.admin_menu!
    const navs = ['en', 'az', 'tr', 'ru'].map(
      (l) => locale(l, 'nav') as Record<string, string>
    )
    for (const item of items) {
      expect(item.route.startsWith(P)).toBe(true)
      expect(preorderPermissions).toContain(item.permission)
      for (const nav of navs) expect(nav[item.key], item.key).toBeTruthy()
    }
    for (const nav of navs) expect(nav[group.key]).toBeTruthy()
  })

  it('sidebar group disappears when the module is disabled', () => {
    const module = mockModules.find((m) => m.id === 'preorder')!
    expect(menuFor('admin').some((g) => g.module === 'preorder')).toBe(true)
    module.enabled = false
    expect(menuFor('admin').some((g) => g.module === 'preorder')).toBe(false)
    module.enabled = true
  })

  it('route guard rule: disabled or missing module is not enabled', () => {
    const rows = [{ id: 'preorder', enabled: false, installed: true }]
    expect(isModuleEnabled(rows, 'preorder')).toBe(false)
    expect(isModuleEnabled([{ ...rows[0], enabled: true }], 'preorder')).toBe(
      true
    )
  })

  it('has identical locale keys in az/en/tr/ru and no AEC names', () => {
    const en = keys(locale('en')).sort()
    for (const l of ['az', 'tr', 'ru'])
      expect(keys(locale(l)).sort()).toEqual(en)
    expect(JSON.stringify(locale('en'))).not.toMatch(
      /order_details|preorder_product/
    )
  })
})

describe('workflow helpers', () => {
  const steps = {
    request: 'accepted',
    prepayment: 'none',
    final: 'none',
    shipping: 'none',
    delivery: 'none',
    refund: 'none',
  } as const
  it('each step needs the previous one accepted', () => {
    expect(canSetStep(steps, 'request')).toBe(true)
    expect(canSetStep(steps, 'prepayment')).toBe(true)
    expect(canSetStep(steps, 'final')).toBe(false)
    expect(currentStep(steps)).toEqual({ step: 'request', status: 'accepted' })
  })
})

describe('product form rules', () => {
  const ok = { ...productDefaults, name: 'X', category_id: 1, unit_price: 100 }
  it('requires name, category and a positive price', () => {
    expect(productSchema.safeParse(productDefaults).success).toBe(false)
    expect(productSchema.safeParse(ok).success).toBe(true)
  })

  it('discount: percent ≤ 100, flat below the unit price', () => {
    expect(
      productSchema.safeParse({
        ...ok,
        discount_type: 'percent',
        discount: 101,
      }).success
    ).toBe(false)
    expect(
      productSchema.safeParse({ ...ok, discount_type: 'flat', discount: 100 })
        .success
    ).toBe(false)
    expect(
      productSchema.safeParse({ ...ok, discount_type: 'flat', discount: 99 })
        .success
    ).toBe(true)
  })

  it('deposit must be set and below the price when enabled; coupon needs a code', () => {
    expect(
      productSchema.safeParse({
        ...ok,
        prepayment: { enabled: true, type: 'percent', amount: 0 },
      }).success
    ).toBe(false)
    expect(
      productSchema.safeParse({
        ...ok,
        prepayment: { enabled: true, type: 'flat', amount: 100 },
      }).success
    ).toBe(false)
    expect(
      productSchema.safeParse({
        ...ok,
        prepayment: { enabled: true, type: 'percent', amount: 20 },
      }).success
    ).toBe(true)
    expect(
      productSchema.safeParse({
        ...ok,
        coupon: { ...ok.coupon, enabled: true, amount: 10 },
      }).success
    ).toBe(false)
  })

  it('date and shipping ranges must be ordered', () => {
    expect(
      productSchema.safeParse({
        ...ok,
        discount_start: '2026-12-02T10:00',
        discount_end: '2026-12-01T10:00',
      }).success
    ).toBe(false)
    expect(
      productSchema.safeParse({
        ...ok,
        shipping: { ...ok.shipping, min_days: 5, max_days: 2 },
      }).success
    ).toBe(false)
  })
})
