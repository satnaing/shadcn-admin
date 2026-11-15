import { describe, expect, it } from 'vitest'
import { isModuleEnabled } from '@/hooks/use-module-enabled'
import { mockRoutes } from '@/mocks'
import { menuFor } from '@/mocks/menu.routes'
import { mockModules } from '@/mocks/modules.data'
import { ALL_PERMISSIONS, PERMISSIONS } from '@/shared/permissions'
import { rejectReasonText, rejectSchema } from './data/refund.schema'
import { refundManifest, refundPermissions } from './module.manifest'

type Row = Record<string, string | number | boolean | null | object>
type Body = { data: Row[] & Row; meta?: { total: number } }
const P = '/admin/refund'
const get = (path: string, query: Record<string, string> = {}, params: string[] = []) =>
  mockRoutes[`GET ${P}${path}`]({ params, query }) as Body
const write = (method: string, path: string, body?: unknown, params: string[] = []) =>
  mockRoutes[`${method} ${P}${path}`]({ params, query: {}, body })
const all = { per_page: '1000' }

const files = import.meta.glob<string>('/public/locales/*/*.json', { query: '?raw', import: 'default', eager: true })
const locale = (lang: string, ns = 'refund') =>
  JSON.parse(files[`/public/locales/${lang}/${ns}.json`]) as Record<string, unknown>
const keys = (o: unknown, prefix = ''): string[] =>
  Object.entries(o as Record<string, unknown>).flatMap(([k, v]) =>
    v && typeof v === 'object' ? keys(v, `${prefix}${k}.`) : [`${prefix}${k}`]
  )

describe('refund manifest', () => {
  it('declares exactly the permissions of the single tree group', () => {
    expect([...refundPermissions].sort()).toEqual(Object.values(PERMISSIONS.REFUND).sort())
    expect(new Set(ALL_PERMISSIONS).size).toBe(ALL_PERMISSIONS.length)
    expect(refundPermissions.some((p) => p.endsWith('_own'))).toBe(false)
  })

  it('menu items live under /admin/refund and use declared permissions + nav keys in every language', () => {
    const { items, group } = refundManifest.admin_menu!
    const navs = ['en', 'az', 'tr', 'ru'].map((l) => locale(l, 'nav') as Record<string, string>)
    for (const item of items) {
      expect(item.route.startsWith(P)).toBe(true)
      expect(refundPermissions).toContain(item.permission)
      for (const nav of navs) expect(nav[item.key], item.key).toBeTruthy()
    }
    for (const nav of navs) expect(nav[group.key]).toBeTruthy()
  })

  it('sidebar group disappears when the module is disabled', () => {
    const module = mockModules.find((m) => m.id === 'refund')!
    expect(menuFor('admin').some((g) => g.module === 'refund')).toBe(true)
    module.enabled = false
    expect(menuFor('admin').some((g) => g.module === 'refund')).toBe(false)
    module.enabled = true
  })

  it('route guard rule: disabled or missing module is not enabled', () => {
    const rows = [{ id: 'refund', enabled: false, installed: true }]
    expect(isModuleEnabled(rows, 'refund')).toBe(false)
    expect(isModuleEnabled([{ ...rows[0], enabled: true }], 'refund')).toBe(true)
  })

  it('has identical locale keys in az/en/tr/ru and no AEC names', () => {
    const en = keys(locale('en')).sort()
    for (const l of ['az', 'tr', 'ru']) expect(keys(locale(l)).sort()).toEqual(en)
    expect(JSON.stringify(locale('en'))).not.toMatch(/order_details/)
  })
})

describe('refund requests mock', () => {
  it('lists are `{data, meta}` with 10+ rows, server-side q/page/tab', () => {
    const page = get('/requests')
    expect(page.data.length).toBeGreaterThan(0)
    expect(page.meta?.total).toBeGreaterThanOrEqual(10)
    expect(get('/requests', { page: '2', per_page: '5' }).data).toHaveLength(5)
    const first = get('/requests', all).data[0]
    expect(get('/requests', { q: String(first.code), ...all }).data.length).toBeLessThan(get('/requests', all).data.length)
    const pending = get('/requests', { tab: 'pending', ...all }).data
    expect(pending.length).toBeGreaterThan(0)
    expect(pending.every((r) => r.status === 'pending')).toBe(true)
    expect(get('/requests', { tab: 'offline', ...all }).data.every((r) => r.payment_channel === 'offline')).toBe(true)
    expect(get('/requests', { tab: 'admin', ...all }).data.every((r) => r.seller_type === 'admin')).toBe(true)
  })

  it('pay approves a pending refund and the next GET shows it; offline keeps the transaction id', () => {
    const [target, other] = get('/requests', { tab: 'pending', ...all }).data
    write('POST', '/requests/:id/pay', { method: 'wallet' }, [String(target.id)])
    const paid = get('/requests/:id', {}, [String(target.id)]).data
    expect(paid.status).toBe('approved')
    expect(paid.paid_at).toBeTruthy()
    write('POST', '/requests/:id/pay', { method: 'offline', transaction_id: 'TRX-1', receipt: '' }, [String(other.id)])
    expect(get('/requests/:id', {}, [String(other.id)]).data.transaction_id).toBe('TRX-1')
  })

  it('reject stores the reason; a decided refund cannot be changed again', () => {
    const target = get('/requests', { tab: 'pending', ...all }).data[0]
    write('POST', '/requests/:id/reject', { reason: 'Return period expired' }, [String(target.id)])
    const row = get('/requests/:id', {}, [String(target.id)]).data
    expect([row.status, row.reject_reason]).toEqual(['rejected', 'Return period expired'])
    write('POST', '/requests/:id/pay', { method: 'wallet' }, [String(target.id)])
    expect(get('/requests/:id', {}, [String(target.id)]).data.status).toBe('rejected')
  })
})

describe('refund disputes mock', () => {
  it('lists only rejected refunds that carry a dispute; approve/reject write the dispute', () => {
    const rows = get('/disputes', all).data
    expect(rows.length).toBeGreaterThan(0)
    expect(rows.every((r) => r.dispute_status !== null)).toBe(true)
    const pending = get('/disputes', { tab: 'pending', ...all }).data
    write('POST', '/disputes/:id/reject', { reason: 'No proof' }, [String(pending[0].id)])
    write('POST', '/disputes/:id/pay', { method: 'wallet' }, [String(pending[1].id)])
    const dispute = (id: Row['id']) => (get('/requests/:id', {}, [String(id)]).data.dispute as { status: string; reject_reason: string })
    expect(dispute(pending[0].id)).toMatchObject({ status: 'rejected', reject_reason: 'No proof' })
    expect(dispute(pending[1].id).status).toBe('approved')
  })
})

describe('refund reasons mock', () => {
  it('filters by kind and active, creates, updates, toggles in bulk and deletes', () => {
    const rejection = get('/reasons', { kind: 'rejection', ...all }).data
    expect(rejection.length).toBeGreaterThan(0)
    expect(rejection.every((r) => r.kind === 'rejection')).toBe(true)
    const translations = { az: 'Yeni XYZ səbəb', en: 'New reason', tr: '', ru: '' }
    const created = write('POST', '/reasons', { kind: 'customer', translations }) as { data: Row }
    expect(get('/reasons', { q: 'Yeni XYZ səbəb', ...all }).data).toHaveLength(1)
    write('PUT', '/reasons/:id', { kind: 'customer', translations: { ...translations, az: 'Yenilənmiş XYZ' } }, [String(created.data.id)])
    expect(get('/reasons', { q: 'Yenilənmiş XYZ', ...all }).data[0].reason).toBe('Yenilənmiş XYZ')
    write('PATCH', '/reasons/status', { ids: [created.data.id], is_active: false })
    expect(get('/reasons', { kind: 'customer', active: '1', ...all }).data.some((r) => r.id === created.data.id)).toBe(false)
    write('DELETE', '/reasons/:id', undefined, [String(created.data.id)])
    expect(get('/reasons', { q: 'Yenilənmiş XYZ', ...all }).data).toHaveLength(0)
  })
})

describe('refund categories mock', () => {
  it('main/unassigned filters; setting days cascades to sub-categories; bulk assigns many', () => {
    const rows = get('/categories', all).data
    const main = get('/categories', { main: '1', ...all }).data
    expect(main.length).toBeLessThan(rows.length)
    expect(main.every((r) => r.parent_name === null)).toBe(true)
    expect(get('/categories', { unassigned: '1', ...all }).data.every((r) => r.refund_days === 0)).toBe(true)

    const parent = main[0]
    write('PUT', '/categories/:id', { refund_days: 30 }, [String(parent.id)])
    const children = get('/categories', all).data.filter((r) => r.parent_name === parent.name)
    expect(children.length).toBeGreaterThan(0)
    expect(children.every((r) => r.refund_days === 30)).toBe(true)

    write('POST', '/categories/bulk-days', { ids: [main[1].id, main[2].id], refund_days: 5 })
    const after = get('/categories', all).data
    expect(after.find((r) => r.id === main[1].id)?.refund_days).toBe(5)
    expect(after.filter((r) => r.parent_name === main[2].name).every((r) => r.refund_days === 5)).toBe(true)
  })
})

describe('refund settings mock', () => {
  it('saves and returns the settings', () => {
    write('PUT', '/settings', { refund_days: 12, dispute_enabled: false })
    expect(get('/settings').data).toMatchObject({ refund_days: 12, dispute_enabled: false })
  })
})

describe('refund forms', () => {
  it('reject form needs a preset, and custom text when "others"', () => {
    expect(rejectSchema.safeParse({ preset: '', custom: '' }).success).toBe(false)
    expect(rejectSchema.safeParse({ preset: 'others', custom: ' ' }).success).toBe(false)
    const ok = { preset: 'others', custom: ' Damaged by user ' }
    expect(rejectSchema.safeParse(ok).success).toBe(true)
    expect(rejectReasonText(ok)).toBe('Damaged by user')
    expect(rejectReasonText({ preset: 'Return period expired', custom: '' })).toBe('Return period expired')
  })
})
