import { mockRoutes } from '@/mocks'
import { menuFor } from '@/mocks/menu.routes'
import { mockModules } from '@/mocks/modules.data'
import { ALL_PERMISSIONS, PERMISSIONS } from '@/shared/permissions'
import { describe, expect, it } from 'vitest'
import { isModuleEnabled } from '@/hooks/use-module-enabled'
import { GATEWAY_FIELDS, isConfigured, maskCredentials, mergeCredentials } from './data/otp.gateways'
import { bulkSmsSchema, gatewaySchema, placeholders, templateSchema } from './data/otp.schema'
import { GATEWAY_KEYS, SECRET_MASK } from './data/otp.type'
import { otpManifest, otpPermissions } from './module.manifest'

type Row = Record<string, string | number | boolean | null | object>
type Body = { data: Row[] & Row; meta?: { total: number; last_page: number }; message?: string }
const P = '/admin/otp'
const get = (path: string, query: Record<string, string> = {}, params: string[] = []) =>
  mockRoutes[`GET ${P}${path}`]({ params, query }) as Body
const write = (method: string, path: string, body?: unknown, params: string[] = []) =>
  mockRoutes[`${method} ${P}${path}`]({ params, query: {}, body }) as Body
const all = { per_page: '1000' }

const files = import.meta.glob<string>('/public/locales/*/*.json', { query: '?raw', import: 'default', eager: true })
const locale = (lang: string, ns = 'otp') =>
  JSON.parse(files[`/public/locales/${lang}/${ns}.json`]) as Record<string, unknown>
const keys = (o: unknown, prefix = ''): string[] =>
  Object.entries(o as Record<string, unknown>).flatMap(([k, v]) =>
    v && typeof v === 'object' ? keys(v, `${prefix}${k}.`) : [`${prefix}${k}`]
  )

describe('otp manifest', () => {
  it('declares exactly the permissions of the single tree group', () => {
    expect([...otpPermissions].sort()).toEqual(Object.values(PERMISSIONS.OTP).sort())
    expect(new Set(ALL_PERMISSIONS).size).toBe(ALL_PERMISSIONS.length)
    expect(otpPermissions.some((p) => p.endsWith('_own'))).toBe(false)
  })

  it('menu items live under /admin/otp and use declared permissions + nav keys in every language', () => {
    const { items, group } = otpManifest.admin_menu!
    const navs = ['en', 'az', 'tr', 'ru'].map((l) => locale(l, 'nav') as Record<string, string>)
    for (const item of items) {
      expect(item.route.startsWith(P)).toBe(true)
      expect(otpPermissions).toContain(item.permission)
      for (const nav of navs) expect(nav[item.key], item.key).toBeTruthy()
    }
    for (const nav of navs) expect(nav[group.key]).toBeTruthy()
  })

  it('sidebar group disappears when the module is disabled', () => {
    const module = mockModules.find((m) => m.id === 'otp')!
    expect(menuFor('admin').some((g) => g.module === 'otp')).toBe(true)
    module.enabled = false
    expect(menuFor('admin').some((g) => g.module === 'otp')).toBe(false)
    module.enabled = true
  })

  it('route guard rule: disabled or missing module is not enabled', () => {
    const rows = [{ id: 'otp', enabled: false, installed: true }]
    expect(isModuleEnabled(rows, 'otp')).toBe(false)
    expect(isModuleEnabled([{ ...rows[0], enabled: true }], 'otp')).toBe(true)
  })

  it('has identical locale keys in az/en/tr/ru and every role group label', () => {
    const en = keys(locale('en')).sort()
    for (const l of ['az', 'tr', 'ru']) expect(keys(locale(l)).sort()).toEqual(en)
    for (const l of ['en', 'az', 'tr', 'ru']) {
      expect((locale(l, 'roles').groups as Record<string, string>).otp).toBeTruthy()
    }
  })

  it('has a label for every gateway, credential, option, hint and template identifier', () => {
    const en = locale('en') as {
      gateways: { names: object; fields: object; options: Record<string, object>; hints: object }
      templates: { names: object }
    }
    for (const key of GATEWAY_KEYS) {
      expect(en.gateways.names).toHaveProperty(key)
      for (const f of GATEWAY_FIELDS[key]) {
        expect(en.gateways.fields, f.name).toHaveProperty(f.name)
        if (f.hint) expect(en.gateways.hints, f.name).toHaveProperty(f.name)
        for (const o of f.options ?? []) expect(en.gateways.options[f.name], `${f.name}.${o}`).toHaveProperty(o)
      }
    }
    for (const t of get('/templates', all).data) expect(en.templates.names).toHaveProperty(String(t.identifier))
  })
})

describe('otp gateway rules', () => {
  it('every gateway has fields and secrets are masked then kept when the mask comes back', () => {
    for (const key of GATEWAY_KEYS) expect(GATEWAY_FIELDS[key].length).toBeGreaterThan(0)
    const stored = { auth_key: 'real-secret', entity_id: 'E1', route: 'p', language: 'english', sender_id: 'S' }
    const masked = maskCredentials('fast2sms', stored)
    expect(masked.auth_key).toBe(SECRET_MASK)
    expect(masked.entity_id).toBe('E1')
    expect(mergeCredentials('fast2sms', stored, masked).auth_key).toBe('real-secret')
    expect(mergeCredentials('fast2sms', stored, { ...masked, auth_key: 'new' }).auth_key).toBe('new')
  })

  it('a gateway is configured only when every required credential is filled', () => {
    expect(isConfigured('mimo', { username: 'u', password: 'p', sender_id: '' })).toBe(false)
    expect(isConfigured('mimo', { username: 'u', password: 'p', sender_id: 'S' })).toBe(true)
    expect(isConfigured('twilio', { sid: 's', auth_token: 't' })).toBe(true)
  })

  it('the credentials schema checks required fields, option lists and URLs (AEC checked none)', () => {
    const schema = gatewaySchema('zender')
    const ok = { site_url: 'https://z.example.com', api_key: 'k', service: 'sms', whatsapp: '', device: '', gateway: '', sim: '1' }
    expect(schema.safeParse(ok).success).toBe(true)
    expect(schema.safeParse({ ...ok, api_key: '' }).success).toBe(false)
    expect(schema.safeParse({ ...ok, site_url: 'zender.com' }).success).toBe(false)
    expect(schema.safeParse({ ...ok, sim: '3' }).success).toBe(false)
    expect(gatewaySchema('ssl_wireless').safeParse({ api_token: 't', sid: 's', url: '' }).success).toBe(true)
  })
})

describe('otp template rules', () => {
  it('reads [[variables]] and requires the same set (AEC only asked not to change them)', () => {
    const original = 'Your delivery status is [[delivery_status]] for [[order_code]] [[order_code]]'
    expect(placeholders(original).sort()).toEqual(['delivery_status', 'order_code'])
    const schema = templateSchema(original)
    const base = { template_id: '', active: true }
    expect(schema.safeParse({ ...base, body: 'Status [[delivery_status]], order [[order_code]]' }).success).toBe(true)
    expect(schema.safeParse({ ...base, body: 'Status [[delivery_status]]' }).success).toBe(false)
    expect(schema.safeParse({ ...base, body: '[[delivery_status]] [[order_code]] [[other]]' }).success).toBe(false)
    expect(schema.safeParse({ ...base, body: '' }).success).toBe(false)
  })

  it('bulk SMS needs a recipient and text', () => {
    expect(bulkSmsSchema.safeParse({ phones: [], content: 'x', template_id: '' }).success).toBe(false)
    expect(bulkSmsSchema.safeParse({ phones: ['+994501111111'], content: '  ', template_id: '' }).success).toBe(false)
    expect(bulkSmsSchema.safeParse({ phones: ['+994501111111'], content: 'Hi', template_id: '' }).success).toBe(true)
  })
})

describe('otp mock reads and writes', () => {
  it('settings keep what was written', () => {
    write('PUT', '/settings', { guest_checkout_with_otp: true })
    expect(get('/settings').data).toMatchObject({ guest_checkout_with_otp: true, login_with_otp: true })
  })

  it('gateways never expose secrets and only one is active at a time', () => {
    const list = get('/gateways').data as unknown as { key: string; active: boolean; credentials: Record<string, string> }[]
    expect(list).toHaveLength(9)
    expect(list.find((g) => g.key === 'fast2sms')!.credentials.auth_key).toBe(SECRET_MASK)
    expect(list.filter((g) => g.active)).toHaveLength(1)

    write('PUT', '/gateways/:key/activation', { active: true }, ['nexmo'])
    const after = get('/gateways').data as unknown as { key: string; active: boolean }[]
    expect(after.filter((g) => g.active).map((g) => g.key)).toEqual(['nexmo'])

    write('PUT', '/gateways/:key/activation', { active: false }, ['nexmo'])
    expect((get('/gateways').data as unknown as { active: boolean }[]).some((g) => g.active)).toBe(false)
  })

  it('saving credentials with the mask keeps the secret, a new value replaces it', () => {
    const before = (get('/gateways').data as unknown as { key: string; credentials: Record<string, string> }[]).find(
      (g) => g.key === 'nexmo'
    )!
    write('PUT', '/gateways/:key', { credentials: { ...before.credentials, sender_id: 'NEW' } }, ['nexmo'])
    const after = (get('/gateways').data as unknown as { key: string; credentials: Record<string, string> }[]).find(
      (g) => g.key === 'nexmo'
    )!
    expect(after.credentials).toMatchObject({ sender_id: 'NEW', secret: SECRET_MASK })
    write('PUT', '/gateways/:key', { credentials: { ...before.credentials, key: 'nx-new' } }, ['nexmo'])
    expect(
      (get('/gateways').data as unknown as { key: string; credentials: Record<string, string> }[]).find((g) => g.key === 'nexmo')!
        .credentials.key
    ).toBe('nx-new')
  })

  it('templates: `{data, meta}`, server search and sort, edits visible on the next read', () => {
    const page = get('/templates')
    expect(page.meta!.total).toBe(10)
    expect(page.data).toHaveLength(10)
    expect(get('/templates', { q: 'password' }).data.map((t) => t.identifier)).toContain('password_reset')
    const sorted = get('/templates', { sort: 'identifier', ...all }).data.map((t) => String(t.identifier))
    expect(sorted).toEqual([...sorted].sort((a, b) => a.localeCompare(b)))

    write('PUT', '/templates/:id', { body: 'Changed [[order_code]]', template_id: 'T9' }, ['3'])
    expect(get('/templates', { q: 'Changed' }).data[0]).toMatchObject({ id: 3, template_id: 'T9' })
  })

  it('always-sent templates stay active even when a switch-off is sent', () => {
    write('PUT', '/templates/:id', { active: false }, ['1'])
    expect(get('/templates', all).data.find((t) => t.id === 1)).toMatchObject({ active: true, required: true })
    write('PUT', '/templates/:id', { active: false }, ['3'])
    expect(get('/templates', all).data.find((t) => t.id === 3)!.active).toBe(false)
  })

  it('recipients are searched on the server and capped; bulk send reports the count', () => {
    expect(get('/recipients', { q: 'zzzz' }).data).toHaveLength(0)
    const found = get('/recipients', { q: 'Aysel' }).data
    expect(found.length).toBeGreaterThan(0)
    expect(found[0]).toHaveProperty('phone')
    expect(get('/recipients', { q: '+99450' }).data.length).toBeLessThanOrEqual(20)
    expect(write('POST', '/sms', { phones: ['1', '2', '3'], content: 'Hi', template_id: '' }).data).toMatchObject({ sent: 3 })
  })
})
