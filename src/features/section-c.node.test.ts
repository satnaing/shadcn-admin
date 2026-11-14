import { describe, expect, it } from 'vitest'
import { mockRoutes } from '@/mocks'
import { ALL_PERMISSIONS } from '@/shared/permissions'
import { PERMISSION_GROUPS } from '@/shared/permission-tree'
import { buildGroupSchema } from './settings/data/settings.schema'
import { SETTINGS_FIELDS } from './settings/data/settings-fields'

type Body = { data?: unknown }
const call = (key: string, params: string[] = [], body?: unknown) =>
  (mockRoutes[key] as (ctx: unknown) => Body)({ params, query: {}, body })

describe('permission tree (picker / matrix source)', () => {
  it('lists every permission exactly once and has no *_own keys', () => {
    const names = PERMISSION_GROUPS.flatMap((g) => g.keys.map((k) => k.name))
    expect(names.slice().sort()).toEqual(ALL_PERMISSIONS.slice().sort())
    expect(names.some((n) => n.endsWith('_own'))).toBe(false)
  })
})

describe('roles mock', () => {
  it('returns a single-envelope list of 10+ roles; admin holds the whole tree', () => {
    const rows = call('GET /admin/roles').data as { name: string; permissions: string[] }[]
    expect(rows.length).toBeGreaterThanOrEqual(10)
    expect(rows.find((r) => r.name === 'admin')?.permissions).toEqual(ALL_PERMISSIONS)
    for (const role of rows) expect(role.permissions.every((p) => ALL_PERMISSIONS.includes(p))).toBe(true)
  })

  it('create drops unknown permissions; system role cannot be deleted', () => {
    const created = call('POST /admin/roles', [], {
      name: 'tmp',
      description: '',
      permissions: ['pages.index', 'nope.index'],
    }).data as { id: number; permissions: string[] }
    expect(created.permissions).toEqual(['pages.index'])

    call('DELETE /admin/roles/:id', [String(created.id)])
    call('DELETE /admin/roles/:id', ['1'])
    const names = (call('GET /admin/roles').data as { id: number }[]).map((r) => r.id)
    expect(names).not.toContain(created.id)
    expect(names).toContain(1)
  })
})

describe('settings mocks', () => {
  it('dashboard, languages, currencies and groups have the expected shapes', () => {
    const dash = call('GET /admin/dashboard').data as { stats: unknown[]; visits: unknown[]; activity: unknown[] }
    expect(dash.stats).toHaveLength(4)
    expect(dash.visits.length).toBeGreaterThan(0)
    expect(Array.isArray(call('GET /admin/languages').data)).toBe(true)
    expect((call('GET /admin/currencies').data as unknown[]).length).toBeGreaterThanOrEqual(10)
    for (const group of Object.keys(SETTINGS_FIELDS)) {
      const values = call('GET /admin/settings/:group', [group]).data as Record<string, unknown>
      for (const field of SETTINGS_FIELDS[group as keyof typeof SETTINGS_FIELDS]) {
        expect(values).toHaveProperty(field.name)
      }
    }
  })

  it('default language cannot be switched off; an inactive one cannot become default', () => {
    call('PATCH /admin/languages/:id', ['1'], { is_active: false })
    call('PATCH /admin/languages/:id', ['4'], { is_default: true })
    const langs = call('GET /admin/languages').data as { id: number; is_active: boolean; is_default: boolean }[]
    expect(langs.find((l) => l.id === 1)).toMatchObject({ is_active: true, is_default: true })
    expect(langs.find((l) => l.id === 4)?.is_default).toBe(false)
  })

  it('group schema rejects a bad e-mail and a missing required field', () => {
    const schema = buildGroupSchema(SETTINGS_FIELDS.general)
    const ok = call('GET /admin/settings/:group', ['general']).data
    expect(schema.safeParse(ok).success).toBe(true)
    expect(schema.safeParse({ ...(ok as object), admin_email: 'x' }).success).toBe(false)
    expect(schema.safeParse({ ...(ok as object), site_name: '' }).success).toBe(false)
  })
})

const files = import.meta.glob<string>('/public/locales/*/*.json', {
  query: '?raw',
  import: 'default',
  eager: true,
})

describe('locales', () => {
  const keys = (value: unknown, prefix = ''): string[] =>
    Object.entries(value as Record<string, unknown>).flatMap(([k, v]) =>
      typeof v === 'object' && v !== null ? keys(v, `${prefix}${k}.`) : [`${prefix}${k}`]
    )

  it.each(['dashboard', 'settings', 'roles'])('%s.json has identical keys in az/en/tr/ru', (ns) => {
    const read = (lng: string) =>
      keys(JSON.parse(files[`/public/locales/${lng}/${ns}.json`])).sort()
    const en = read('en')
    for (const lng of ['az', 'tr', 'ru']) expect(read(lng)).toEqual(en)
  })
})
