import { describe, expect, it } from 'vitest'
import type { ModuleItem } from '@/api/modules.types'
import { mockRoutes } from '@/mocks'

const call = (key: string, ctx: { params?: string[]; query?: Record<string, string>; body?: unknown } = {}) =>
  mockRoutes[key]({ params: ctx.params ?? [], query: ctx.query ?? {}, body: ctx.body }) as { data: unknown; meta?: { total: number } }

describe('blogs mock', () => {
  it('lists 10+ rows in a single data envelope with paging meta', () => {
    const body = call('GET /admin/blogs', { query: { per_page: '30' } })
    expect(Array.isArray(body.data)).toBe(true)
    expect((body.data as unknown[]).length).toBeGreaterThanOrEqual(10)
    expect(body.meta?.total).toBeGreaterThanOrEqual(10)
  })

  it('filters by status and category server-side', () => {
    const rows = call('GET /admin/blogs', { query: { status: 'draft', per_page: '50' } }).data as { status: string }[]
    expect(rows.length).toBeGreaterThan(0)
    expect(rows.every((r) => r.status === 'draft')).toBe(true)
    const cat = call('GET /admin/blogs', { query: { category: '1', per_page: '50' } }).data as { category_id: number }[]
    expect(cat.every((r) => r.category_id === 1)).toBe(true)
  })

  it('detail carries all four locales and categories are paged', () => {
    const detail = call('GET /admin/blogs/:id', { params: ['1'] }).data as { translations: Record<string, unknown> }
    expect(Object.keys(detail.translations).sort()).toEqual(['az', 'en', 'ru', 'tr'])
    expect((call('GET /admin/blog-categories').data as unknown[]).length).toBeGreaterThan(0)
  })
})

describe('modules mock', () => {
  const list = () => call('GET /admin/modules').data as ModuleItem[]

  it('has 12+ modules incl. required core, dependency edges and not-installed ones', () => {
    const modules = list()
    expect(modules.length).toBeGreaterThanOrEqual(12)
    expect(modules.some((m) => m.required)).toBe(true)
    expect(modules.some((m) => m.requires.length > 0)).toBe(true)
    expect(modules.some((m) => !m.installed)).toBe(true)
    expect(modules.some((m) => m.update_available)).toBe(true)
  })

  it('never disables a required module (batch and patch)', () => {
    call('POST /admin/modules/batch', { body: { changes: [{ id: 'identity', enabled: false }] } })
    call('PATCH /admin/modules/:id', { params: ['identity'], body: { enabled: false } })
    expect(list().find((m) => m.id === 'identity')?.enabled).toBe(true)
  })

  it('batch save toggles optional modules', () => {
    call('POST /admin/modules/batch', { body: { changes: [{ id: 'refund', enabled: true }] } })
    expect(list().find((m) => m.id === 'refund')?.enabled).toBe(true)
  })

  it('update clears available update', () => {
    call('POST /admin/modules/:id/update', { params: ['coupon'] })
    expect(list().find((m) => m.id === 'coupon')?.update_available).toBeUndefined()
  })
})
