import { mockRoutes } from '@/mocks'
import { menuFor } from '@/mocks/menu.routes'
import { mockModules } from '@/mocks/modules.data'
import { ALL_PERMISSIONS, PERMISSIONS } from '@/shared/permissions'
import { describe, expect, it } from 'vitest'
import { isModuleEnabled } from '@/hooks/use-module-enabled'
import { locationSchema, settingsSchema, toCoordinate } from './data/map-provider.schema'
import { maskKeys, mergeKeys } from './data/map-provider.secrets'
import { type MapSettings, SECRET_MASK } from './data/map-provider.type'
import { mapProviderManifest, mapProviderPermissions } from './module.manifest'

type Body = { data: Record<string, string | number | boolean | null>; message?: string }
const P = '/admin/map-provider'
const get = () => mockRoutes[`GET ${P}/settings`]({ params: [], query: {} }) as Body
const put = (path: string, body: unknown) => mockRoutes[`PUT ${P}${path}`]({ params: [], query: {}, body }) as Body

const files = import.meta.glob<string>('/public/locales/*/*.json', { query: '?raw', import: 'default', eager: true })
const locale = (lang: string, ns = 'map_provider') =>
  JSON.parse(files[`/public/locales/${lang}/${ns}.json`]) as Record<string, unknown>
const keys = (o: unknown, prefix = ''): string[] =>
  Object.entries(o as Record<string, unknown>).flatMap(([k, v]) =>
    v && typeof v === 'object' ? keys(v, `${prefix}${k}.`) : [`${prefix}${k}`]
  )

const base: MapSettings = { enabled: true, provider: 'osm', google_api_key: '', maptiler_key: '', yandex_key: '' }

describe('map-provider manifest', () => {
  it('declares exactly the permissions of the single tree group', () => {
    expect([...mapProviderPermissions].sort()).toEqual(Object.values(PERMISSIONS.MAP_PROVIDER).sort())
    expect(new Set(ALL_PERMISSIONS).size).toBe(ALL_PERMISSIONS.length)
  })

  it('menu item lives under /admin/map-provider with a declared permission and nav keys in every language', () => {
    const { items, group } = mapProviderManifest.admin_menu!
    const navs = ['en', 'az', 'tr', 'ru'].map((l) => locale(l, 'nav') as Record<string, string>)
    for (const item of items) {
      expect(item.route.startsWith(P)).toBe(true)
      expect(mapProviderPermissions).toContain(item.permission)
      for (const nav of navs) expect(nav[item.key], item.key).toBeTruthy()
    }
    for (const nav of navs) expect(nav[group.key]).toBeTruthy()
  })

  it('sidebar group disappears when the module is disabled', () => {
    const module = mockModules.find((m) => m.id === 'map-provider')!
    expect(menuFor('admin').some((g) => g.module === 'map-provider')).toBe(true)
    module.enabled = false
    expect(menuFor('admin').some((g) => g.module === 'map-provider')).toBe(false)
    module.enabled = true
  })

  it('route guard rule: disabled or missing module is not enabled', () => {
    const rows = [{ id: 'map-provider', enabled: false, installed: true }]
    expect(isModuleEnabled(rows, 'map-provider')).toBe(false)
    expect(isModuleEnabled([{ ...rows[0], enabled: true }], 'map-provider')).toBe(true)
  })

  it('has identical locale keys in az/en/tr/ru and a role group label', () => {
    const en = keys(locale('en')).sort()
    for (const l of ['az', 'tr', 'ru']) expect(keys(locale(l)).sort()).toEqual(en)
    for (const l of ['en', 'az', 'tr', 'ru']) {
      expect((locale(l, 'roles').groups as Record<string, string>).map_provider).toBeTruthy()
    }
  })
})

describe('map-provider rules', () => {
  it('OpenStreetMap needs no key; the other providers need theirs while the map is on', () => {
    expect(settingsSchema.safeParse(base).success).toBe(true)
    expect(settingsSchema.safeParse({ ...base, provider: 'google' }).success).toBe(false)
    expect(settingsSchema.safeParse({ ...base, provider: 'google', google_api_key: 'k' }).success).toBe(true)
    expect(settingsSchema.safeParse({ ...base, provider: 'maptiler', yandex_key: 'k' }).success).toBe(false)
    expect(settingsSchema.safeParse({ ...base, provider: 'yandex', yandex_key: 'k' }).success).toBe(true)
    expect(settingsSchema.safeParse({ ...base, enabled: false, provider: 'google' }).success).toBe(true)
    expect(settingsSchema.safeParse({ ...base, provider: 'bing' }).success).toBe(false)
  })

  it('coordinates: both or none, inside the valid range (AEC saved any text)', () => {
    expect(locationSchema.safeParse({ latitude: '', longitude: '' }).success).toBe(true)
    expect(locationSchema.safeParse({ latitude: '40.4', longitude: '49.8' }).success).toBe(true)
    expect(locationSchema.safeParse({ latitude: '40.4', longitude: '' }).success).toBe(false)
    expect(locationSchema.safeParse({ latitude: '91', longitude: '10' }).success).toBe(false)
    expect(locationSchema.safeParse({ latitude: '10', longitude: '-181' }).success).toBe(false)
    expect(locationSchema.safeParse({ latitude: 'abc', longitude: '10' }).success).toBe(false)
    expect(toCoordinate(' ')).toBeNull()
    expect(toCoordinate('49.8')).toBe(49.8)
  })

  it('keys are masked on the way out and kept when the mask comes back', () => {
    const stored = { ...base, google_api_key: 'real-key' }
    const masked = maskKeys(stored)
    expect(masked.google_api_key).toBe(SECRET_MASK)
    expect(masked.maptiler_key).toBe('')
    expect(mergeKeys(stored, masked).google_api_key).toBe('real-key')
    expect(mergeKeys(stored, { ...masked, google_api_key: 'new' }).google_api_key).toBe('new')
  })
})

describe('map-provider mock reads and writes', () => {
  it('never exposes a stored key and keeps it when the mask is sent back', () => {
    const before = get().data
    expect(before.google_api_key).toBe(SECRET_MASK)
    put('/settings', { ...base, provider: 'google', google_api_key: SECRET_MASK })
    const after = get().data
    expect(after).toMatchObject({ provider: 'google', google_api_key: SECRET_MASK })
    put('/settings', { ...base, provider: 'google', google_api_key: 'another' })
    expect(get().data.google_api_key).toBe(SECRET_MASK)
  })

  it('the default location is saved separately and visible on the next read', () => {
    put('/location', { latitude: 41.1, longitude: 48.2 })
    expect(get().data).toMatchObject({ latitude: 41.1, longitude: 48.2 })
    put('/location', { latitude: null, longitude: null })
    expect(get().data).toMatchObject({ latitude: null, longitude: null })
  })
})
