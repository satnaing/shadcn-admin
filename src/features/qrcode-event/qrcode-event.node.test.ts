import { describe, expect, it } from 'vitest'
import { isModuleEnabled } from '@/hooks/use-module-enabled'
import { mockRoutes } from '@/mocks'
import { menuFor } from '@/mocks/menu.routes'
import { mockModules } from '@/mocks/modules.data'
import { ALL_PERMISSIONS, PERMISSIONS } from '@/shared/permissions'
import { qrcodeEventManifest, qrcodeEventPermissions } from './module.manifest'

type Row = Record<string, string | number | boolean | null | number[]>
type Body = { data: Row[] & Row; meta?: { total: number } }
const P = '/admin/qrcode-event'
const get = (path: string, query: Record<string, string> = {}, params: string[] = []) =>
  mockRoutes[`GET ${P}${path}`]({ params, query }) as Body
const write = (method: string, path: string, body?: unknown, params: string[] = []) =>
  mockRoutes[`${method} ${P}${path}`]({ params, query: {}, body })

const files = import.meta.glob<string>('/public/locales/*/*.json', { query: '?raw', import: 'default', eager: true })
const locale = (lang: string, ns = 'qrcode_event') =>
  JSON.parse(files[`/public/locales/${lang}/${ns}.json`]) as Record<string, unknown>
const keys = (o: unknown, prefix = ''): string[] =>
  Object.entries(o as Record<string, unknown>).flatMap(([k, v]) =>
    v && typeof v === 'object' ? keys(v, `${prefix}${k}.`) : [`${prefix}${k}`]
  )

describe('qrcode-event manifest', () => {
  it('declares exactly the permissions of the single tree group', () => {
    expect([...qrcodeEventPermissions].sort()).toEqual(Object.values(PERMISSIONS.QRCODE_EVENT).sort())
    expect(new Set(ALL_PERMISSIONS).size).toBe(ALL_PERMISSIONS.length)
    expect(qrcodeEventPermissions.some((p) => p.endsWith('_own'))).toBe(false)
  })

  it('menu items live under /admin/qrcode-event and use declared permissions + nav keys', () => {
    const { items, group } = qrcodeEventManifest.admin_menu!
    const navKeys = ['en', 'az', 'tr', 'ru'].map((l) => locale(l, 'nav') as Record<string, string>)
    expect(items.map((i) => i.order)).toEqual([...items.map((i) => i.order)].sort((a, b) => a - b))
    for (const item of items) {
      expect(item.route.startsWith(P)).toBe(true)
      expect(qrcodeEventPermissions).toContain(item.permission)
      for (const nav of navKeys) expect(nav[item.key], item.key).toBeTruthy()
    }
    for (const nav of navKeys) expect(nav[group.key]).toBeTruthy()
  })

  it('sidebar group disappears when the module is disabled', () => {
    const module = mockModules.find((m) => m.id === 'qrcode-event')!
    expect(menuFor('admin').some((g) => g.module === 'qrcode-event')).toBe(true)
    module.enabled = false
    expect(menuFor('admin').some((g) => g.module === 'qrcode-event')).toBe(false)
    module.enabled = true
  })

  it('route guard rule: disabled or missing module is not enabled', () => {
    const rows = [{ id: 'qrcode-event', enabled: false, installed: true }]
    expect(isModuleEnabled(rows, 'qrcode-event')).toBe(false)
    expect(isModuleEnabled([{ ...rows[0], enabled: true }], 'qrcode-event')).toBe(true)
    expect(isModuleEnabled(rows, 'unknown')).toBe(false)
  })

  it('has identical locale keys in az/en/tr/ru', () => {
    const en = keys(locale('en')).sort()
    for (const l of ['az', 'tr', 'ru']) expect(keys(locale(l)).sort()).toEqual(en)
  })
})

describe('qrcode-event mocks', () => {
  it('lists are `{data: rows, meta}` with 10-30 rows per page and server-side q/page', () => {
    for (const path of ['/campaigns', '/batches', '/codes', '/logs']) {
      const page = get(path)
      expect(Array.isArray(page.data), path).toBe(true)
      expect(page.data.length).toBeGreaterThan(0)
      expect(page.meta?.total).toBeGreaterThanOrEqual(10)
    }
    const all = get('/codes', { per_page: '1000' })
    const one = get('/codes', { q: String(all.data[0].code), per_page: '1000' })
    expect(one.data.length).toBeLessThan(all.data.length)
    expect(get('/codes', { page: '2', per_page: '5' }).data).toHaveLength(5)
  })

  it('applies code and log filters', () => {
    expect(get('/codes', { status: 'disabled', per_page: '1000' }).data.every((c) => c.status === 'disabled')).toBe(true)
    expect(get('/codes', { winner: '1', per_page: '1000' }).data.every((c) => c.prize_id !== null)).toBe(true)
    expect(get('/logs', { result: 'win', per_page: '1000' }).data.every((c) => c.result === 'win')).toBe(true)
  })

  it('campaign writes are visible on the next GET (create, status, delete cascade)', () => {
    const before = get('/campaigns', { per_page: '1000' }).meta!.total
    const created = write('POST', '/campaigns', { name: 'Test run', status: 'draft', code_prefix: 'TST' }) as Body
    const id = Number(created.data.id)
    expect(get('/campaigns', { per_page: '1000' }).meta!.total).toBe(before + 1)

    write('PATCH', '/campaigns/:id/status', { status: 'active' }, [String(id)])
    expect(get('/campaigns/:id', {}, [String(id)]).data.status).toBe('active')

    write('POST', '/campaigns/:id/prizes', { type: 'gift', title: 'Mug', quantity: 3, product_ids: [] }, [String(id)])
    expect(get('/campaigns/:id/prizes', {}, [String(id)]).data).toHaveLength(1)

    write('DELETE', '/campaigns/:id', undefined, [String(id)])
    expect(get('/campaigns', { per_page: '1000' }).meta!.total).toBe(before)
    expect(get('/campaigns/:id/prizes', {}, [String(id)]).data).toHaveLength(0)
  })

  it('batch generation allocates prizes; claim flow marks a revealed winner as handed over', () => {
    const campaignId = 1
    const prizes = () => get('/campaigns/:id/prizes', {}, [String(campaignId)]).data
    const prize = prizes()[0]
    const allocatedBefore = Number(prize.allocated_count)
    const codesBefore = get('/codes', { batch_id: '', per_page: '1000' }).meta!.total
    write('POST', '/batches', { campaign_id: campaignId, quantity: 5, prize_allocation: { [String(prize.id)]: 2 }, product_id: null, note: 'x' })
    expect(get('/codes', { per_page: '1000' }).meta!.total).toBe(codesBefore + 5)
    const after = prizes().find((p) => p.id === prize.id)!
    expect(Number(after.allocated_count)).toBe(allocatedBefore + 2)

    const winner = get('/codes', { winner: '1', status: 'checked', per_page: '1000' }).data[0]
    write('POST', '/codes/:id/claim', { claim_note: 'ok' }, [String(winner.id)])
    expect(get('/codes/:id', {}, [String(winner.id)]).data.status).toBe('claimed')
  })

  it('exports return a download link and settings persist', () => {
    const link = get('/codes/export').data
    expect(String(link.download_url).startsWith('blob:')).toBe(true)
    write('PUT', '/settings', { ios_team_id: 'ZZ99' })
    expect(get('/settings').data.ios_team_id).toBe('ZZ99')
  })
})
