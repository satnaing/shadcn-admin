import { describe, expect, it } from 'vitest'
import { mockRoutes } from '@/mocks'
import { emptyBanner } from './banner-defaults'
import { getPath, moveItem, setPath } from './set-path'

type Body = { data: Record<string, unknown> & { length?: number } }
const get = (key: string, query: Record<string, string> = {}) => mockRoutes[key]({ params: [], query }) as Body

describe('list rows (object and bare-localized)', () => {
  const doc = { paymentMethods: { items: [{ code: 'visa', label: 'Visa' }, { code: 'payriff', label: '' }] }, perks: [{ az: 'a' }] }

  it('writes a sub-field of one object row without touching the others', () => {
    const next = setPath(doc, 'paymentMethods.items.1.code', 'mastercard')
    expect(getPath(next, 'paymentMethods.items.1.code')).toBe('mastercard')
    expect(getPath(next, 'paymentMethods.items.0')).toEqual({ code: 'visa', label: 'Visa' })
    expect(getPath(doc, 'paymentMethods.items.1.code')).toBe('payriff')
  })

  it('edits a row that is itself a localized map and reorders rows', () => {
    const next = setPath(doc, 'perks.0', { az: 'a', en: 'b' })
    expect(getPath(next, 'perks.0.en')).toBe('b')
    expect(moveItem(doc.paymentMethods.items, 0, 1).map((i) => i.code)).toEqual(['payriff', 'visa'])
  })
})

describe('mock shapes for the 03b editors', () => {
  it('banners carry deal, heroDeal, features and perks', () => {
    const rows = (get('GET /admin/themes/banners').data as unknown) as Record<string, unknown>[]
    expect(rows.length).toBeGreaterThanOrEqual(10)
    for (const key of ['deal', 'heroDeal', 'features', 'perks', 'percent']) expect(rows[0]).toHaveProperty(key)
    expect(Object.keys(emptyBanner('trio'))).toEqual(expect.arrayContaining(['deal', 'heroDeal', 'features', 'perks']))
  })

  it('header has a mobile tab bar, footer payment items are objects, no per-block variants', () => {
    const header = (mockRoutes['GET /admin/themes/settings/:block'] as unknown as (c: unknown) => Body)({ params: ['header'], query: {} }).data
    const footer = (mockRoutes['GET /admin/themes/settings/:block'] as unknown as (c: unknown) => Body)({ params: ['footer'], query: {} }).data
    expect((header.mobileTabBar as unknown[]).length).toBeGreaterThan(0)
    expect(header).not.toHaveProperty('variants')
    expect((footer.paymentMethods as { items: { code: string }[] }).items[0]).toHaveProperty('code')
  })

  it('every theme manifest declares variants[] (xshop 1, senseihost 1)', () => {
    const themes = (get('GET /admin/themes').data as unknown) as { variants: string[] }[]
    expect(themes.map((t) => t.variants.length)).toEqual([1, 1])
  })
})
