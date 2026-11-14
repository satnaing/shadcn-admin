import { beforeEach, describe, expect, it } from 'vitest'
import { mockRoutes } from '@/mocks'
import { senseihostCatalog, xshopCatalog } from '@/mocks/pages.catalog'
import { HISTORY_LIMIT, useBuilderStore } from './builder.store'
import { defaultsOf, fieldsForTab, readText, widgetOf, writeText } from './payload-schema'
import type { PageSection, SchemaNode } from './pages.type'
import { slugify } from './slugify'

const section = (component: string): Omit<PageSection, 'id'> => ({ component, hidden: false, payload: {} })
const store = () => useBuilderStore.getState()
const call = (key: string, ctx: Record<string, unknown> = {}) =>
  (mockRoutes[key] as (c: unknown) => { data: unknown; meta?: { total: number } })({ params: [], query: {}, ...ctx })

describe('builder store', () => {
  beforeEach(() => store().load([]))

  it('adds, moves, duplicates, hides and removes sections', () => {
    store().add(section('A'))
    store().add(section('B'))
    store().add(section('C'), 0)
    expect(store().sections.map((s) => s.component)).toEqual(['C', 'A', 'B'])

    store().move(0, 2)
    expect(store().sections.map((s) => s.component)).toEqual(['A', 'B', 'C'])

    const [first] = store().sections
    store().duplicate(first.id)
    expect(store().sections).toHaveLength(4)
    expect(store().sections[1].id).not.toBe(first.id)

    store().toggleHidden(first.id)
    expect(store().sections[0].hidden).toBe(true)

    store().remove(first.id)
    expect(store().sections.find((s) => s.id === first.id)).toBeUndefined()
  })

  it('undo / redo restores the previous state', () => {
    store().add(section('A'))
    store().add(section('B'))
    store().undo()
    expect(store().sections.map((s) => s.component)).toEqual(['A'])
    store().redo()
    expect(store().sections.map((s) => s.component)).toEqual(['A', 'B'])
    store().add(section('C'))
    expect(store().future).toHaveLength(0)
  })

  it(`keeps at most ${HISTORY_LIMIT} undo steps`, () => {
    for (let i = 0; i < HISTORY_LIMIT + 10; i += 1) store().add(section(`S${i}`))
    expect(store().past).toHaveLength(HISTORY_LIMIT)
    for (let i = 0; i < HISTORY_LIMIT + 5; i += 1) store().undo()
    expect(store().sections).toHaveLength(10)
  })

  it('typing in one field is a single undo step', () => {
    store().add(section('A'))
    const { id } = store().sections[0]
    store().patchPayload(id, { title: 'a' }, 'k')
    store().patchPayload(id, { title: 'ab' }, 'k')
    store().patchPayload(id, { title: 'abc' }, 'k')
    expect(store().past).toHaveLength(2)
    store().undo()
    expect(store().sections[0].payload).toEqual({})
  })

  it('load resets history and the dirty flag', () => {
    store().add(section('A'))
    store().load([])
    expect(store().past).toHaveLength(0)
    expect(store().dirty).toBe(false)
  })
})

describe('payload schema → form mapping', () => {
  it('maps node types and formats to widgets', () => {
    const cases: Array<[SchemaNode, string]> = [
      [{ type: 'string' }, 'text'],
      [{ type: 'string', format: 'textarea' }, 'textarea'],
      [{ type: 'string', format: 'richtext' }, 'richtext'],
      [{ type: 'string', format: 'image' }, 'image'],
      [{ type: 'string', format: 'link' }, 'link'],
      [{ type: 'string', format: 'color' }, 'color'],
      [{ type: 'string', enum: ['a'] }, 'select'],
      [{ type: 'integer' }, 'number'],
      [{ type: 'boolean' }, 'switch'],
      [{ type: 'array', items: { type: 'string' } }, 'list'],
      [{ type: 'object', format: 'source' }, 'source'],
      [{ type: 'object', properties: {} }, 'group'],
    ]
    for (const [node, widget] of cases) expect(widgetOf(node)).toBe(widget)
  })

  it('builds defaults and splits fields by tab', () => {
    const schema = xshopCatalog.find((c) => c.component === 'FlashDealSection')?.payload_schema
    expect(schema).toBeDefined()
    expect(defaultsOf(schema?.properties)).toMatchObject({ title: {}, countdownHours: 0, products: { type: 'manual', ids: '' }, fullWidth: false, paddingY: 'md' })
    expect(fieldsForTab(schema!, 'source').map((f) => f.key)).toEqual(['products'])
    expect(fieldsForTab(schema!, 'style').map((f) => f.key)).toEqual(['background', 'paddingY', 'fullWidth'])
  })

  it('reads and writes localized text per language', () => {
    const value = writeText({ az: 'salam' }, 'en', 'hello')
    expect(value).toEqual({ az: 'salam', en: 'hello' })
    expect(readText(value, 'ru')).toBe('')
    expect(readText('plain', 'az')).toBe('plain')
  })

  it('slugifies Azerbaijani titles', () => {
    expect(slugify('Haqqımızda və Əlaqə')).toBe('haqqimizda-ve-elaqe')
  })
})

describe('pages mock shapes', () => {
  it('lists 14 rows in a single {data, meta} envelope', () => {
    const body = call('GET /admin/pages', { query: { per_page: '30' } })
    expect(Array.isArray(body.data)).toBe(true)
    expect(body.meta?.total).toBe(14)
  })

  it('filters by status and language on the server side', () => {
    const drafts = call('GET /admin/pages', { query: { status: 'draft', per_page: '30' } }).data as Array<{ status: string }>
    expect(drafts.length).toBeGreaterThan(0)
    expect(drafts.every((p) => p.status === 'draft')).toBe(true)
    const ru = call('GET /admin/pages', { query: { lang: 'ru', per_page: '30' } }).data as Array<{ translations: string[] }>
    expect(ru.every((p) => p.translations.includes('ru'))).toBe(true)
  })

  it('returns a detail object, templates, revisions and the section catalog', () => {
    const detail = call('GET /admin/pages/:id', { params: ['1'] }).data as { id: number; sections: unknown[]; is_homepage: boolean }
    expect(detail).toMatchObject({ id: 1, is_homepage: true })
    expect(detail.sections.length).toBeGreaterThan(3)
    expect(Array.isArray(call('GET /admin/page-templates').data)).toBe(true)
    expect(Array.isArray(call('GET /admin/pages/:id/revisions', { params: ['1'] }).data)).toBe(true)
    expect(xshopCatalog.length).toBeGreaterThanOrEqual(10)
    expect(call('GET /admin/themes/active/sections').data).toBe(xshopCatalog)
    expect(call('GET /admin/themes/active/sections', { query: { theme: 'theme-senseihost' } }).data).toBe(senseihostCatalog)
  })

  it('has sections without a schema (raw JSON fallback) and a missing component on the home page', () => {
    expect(xshopCatalog.some((c) => !c.payload_schema)).toBe(true)
    const home = call('GET /admin/pages/:id', { params: ['1'] }).data as { sections: Array<{ component: string }> }
    expect(home.sections.some((s) => !xshopCatalog.some((c) => c.component === s.component))).toBe(true)
  })
})
