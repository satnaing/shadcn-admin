import { describe, expect, it } from 'vitest'
import { mockRoutes } from '@/mocks'

type Paged = { data: { id: number; order?: number }[]; meta: { total: number; per_page: number } }
const call = (key: string, query: Record<string, string> = {}) => mockRoutes[key]({ params: [], query }) as unknown

describe('server-side list params (q/page/per_page/sort)', () => {
  it('banners: q narrows, per_page pages, sort=order is ascending', () => {
    const all = call('GET /admin/themes/banners', { per_page: '100', sort: 'order' }) as Paged
    const page1 = call('GET /admin/themes/banners', { per_page: '5', sort: 'order' }) as Paged
    expect(page1.data).toHaveLength(5)
    expect(page1.meta.total).toBe(all.meta.total)
    const orders = page1.data.map((b) => b.order ?? 0)
    expect(orders).toEqual([...orders].sort((a, b) => a - b))
    const hit = call('GET /admin/themes/banners', { q: 'Headline 3', per_page: '100' }) as Paged
    expect(hit.meta.total).toBeGreaterThan(0)
    expect(hit.meta.total).toBeLessThan(all.meta.total)
  })

  it('roles: paged with ?page, whole list without', () => {
    const paged = call('GET /admin/roles', { page: '1', per_page: '3' }) as Paged
    expect(paged.data).toHaveLength(3)
    expect(paged.meta.total).toBeGreaterThan(3)
    expect((call('GET /admin/roles') as { data: unknown[] }).data.length).toBe(paged.meta.total)
    const none = call('GET /admin/roles', { page: '1', q: 'zzz-no-such-role' }) as Paged
    expect(none.data).toHaveLength(0)
  })

  it('modules: q and filter run on the mock, unfiltered returns everything', () => {
    const everything = (call('GET /admin/modules') as { data: { id: string; enabled: boolean }[] }).data
    const active = (call('GET /admin/modules', { filter: 'active' }) as { data: { enabled: boolean }[] }).data
    expect(active.length).toBeGreaterThan(0)
    expect(active.every((m) => m.enabled)).toBe(true)
    const byName = (call('GET /admin/modules', { q: everything[0].id }) as { data: { id: string }[] }).data
    expect(byName.map((m) => m.id)).toContain(everything[0].id)
    expect(byName.length).toBeLessThan(everything.length)
  })
})
