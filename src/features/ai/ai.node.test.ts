import { mockRoutes } from '@/mocks'
import { menuFor } from '@/mocks/menu.routes'
import { mockModules } from '@/mocks/modules.data'
import { ALL_PERMISSIONS, PERMISSIONS } from '@/shared/permissions'
import { describe, expect, it } from 'vitest'
import { isModuleEnabled } from '@/hooks/use-module-enabled'
import {
  CONTENT_MODELS,
  TRANSLATE_MODELS,
  maskSecret,
  mergeSecret,
  modelKey,
  normalizeTranslateModel,
  promptVariables,
  sameVariables,
} from './data/ai.models'
import { contentSchema, promptSchema, translateSchema } from './data/ai.schema'
import { SECRET_MASK } from './data/ai.type'
import { aiManifest, aiPermissions } from './module.manifest'

type Row = Record<string, string | number | boolean | null | object>
type Body = {
  data: Row[] & Row
  meta?: { total: number; last_page: number }
  stats?: { requests: number; tokens: number; avg_tokens: number; translations: number }
  message?: string
}
const P = '/admin/ai'
const get = (path: string, query: Record<string, string> = {}, params: string[] = []) =>
  mockRoutes[`GET ${P}${path}`]({ params, query }) as Body
const write = (method: string, path: string, body?: unknown, params: string[] = []) =>
  mockRoutes[`${method} ${P}${path}`]({ params, query: {}, body }) as Body
const all = { per_page: '1000' }

const files = import.meta.glob<string>('/public/locales/*/*.json', { query: '?raw', import: 'default', eager: true })
const locale = (lang: string, ns = 'ai') => JSON.parse(files[`/public/locales/${lang}/${ns}.json`]) as Record<string, unknown>
const keys = (o: unknown, prefix = ''): string[] =>
  Object.entries(o as Record<string, unknown>).flatMap(([k, v]) =>
    v && typeof v === 'object' ? keys(v, `${prefix}${k}.`) : [`${prefix}${k}`]
  )

describe('ai manifest', () => {
  it('declares exactly the permissions of the single tree group', () => {
    expect([...aiPermissions].sort()).toEqual(Object.values(PERMISSIONS.AI).sort())
    expect(new Set(ALL_PERMISSIONS).size).toBe(ALL_PERMISSIONS.length)
    expect(aiPermissions.some((p) => p.endsWith('_own'))).toBe(false)
  })

  it('menu items live under /admin/ai and use declared permissions + nav keys in every language', () => {
    const { items, group } = aiManifest.admin_menu!
    const navs = ['en', 'az', 'tr', 'ru'].map((l) => locale(l, 'nav') as Record<string, string>)
    for (const item of items) {
      expect(item.route.startsWith(P)).toBe(true)
      expect(aiPermissions).toContain(item.permission)
      for (const nav of navs) expect(nav[item.key], item.key).toBeTruthy()
    }
    for (const nav of navs) expect(nav[group.key]).toBeTruthy()
  })

  it('replaces the old `ai-tools` placeholder and the sidebar group disappears when disabled', () => {
    expect(mockModules.some((m) => m.id === 'ai-tools')).toBe(false)
    const module = mockModules.find((m) => m.id === 'ai')!
    expect(menuFor('admin').some((g) => g.module === 'ai')).toBe(true)
    module.enabled = false
    expect(menuFor('admin').some((g) => g.module === 'ai')).toBe(false)
    module.enabled = true
  })

  it('route guard rule: disabled or missing module is not enabled', () => {
    const rows = [{ id: 'ai', enabled: false, installed: true }]
    expect(isModuleEnabled(rows, 'ai')).toBe(false)
    expect(isModuleEnabled([{ ...rows[0], enabled: true }], 'ai')).toBe(true)
  })

  it('has identical locale keys in az/en/tr/ru, a role group label and a label for every model and prompt', () => {
    const en = keys(locale('en')).sort()
    for (const l of ['az', 'tr', 'ru']) expect(keys(locale(l)).sort()).toEqual(en)
    for (const l of ['en', 'az', 'tr', 'ru']) {
      expect((locale(l, 'roles').groups as Record<string, string>).ai).toBeTruthy()
      const models = (locale(l) as { models: Record<string, string> }).models
      for (const m of [...CONTENT_MODELS, ...TRANSLATE_MODELS]) expect(models[modelKey(m).replace('models.', '')], m).toBeTruthy()
    }
    const names = (locale('en') as { prompts: { names: object } }).prompts.names
    for (const p of get('/prompts').data) expect(names).toHaveProperty(String(p.identifier))
  })
})

describe('ai rules', () => {
  it('model label keys never contain dots (i18next would read them as nesting)', () => {
    for (const m of [...CONTENT_MODELS, ...TRANSLATE_MODELS]) expect(modelKey(m).split('.')).toHaveLength(2)
  })

  it('retired translation models are migrated to the default (AEC did it silently)', () => {
    expect(normalizeTranslateModel('gemini-2.0-flash')).toBe('gemini-2.5-flash')
    expect(normalizeTranslateModel('')).toBe('gemini-2.5-flash')
    expect(normalizeTranslateModel('gemini-2.5-pro')).toBe('gemini-2.5-pro')
  })

  it('secrets are masked and the mask means "unchanged"', () => {
    expect(maskSecret('real', SECRET_MASK)).toBe(SECRET_MASK)
    expect(maskSecret('', SECRET_MASK)).toBe('')
    expect(mergeSecret('real', SECRET_MASK, SECRET_MASK)).toBe('real')
    expect(mergeSecret('real', 'new', SECRET_MASK)).toBe('new')
  })

  it('content settings need a known model, a key and a whole, non-negative limit (AEC checked none)', () => {
    const ok = { enabled: true, model: 'gemini-2.5-flash', api_key: 'k', seller_monthly_token_limit: 100 }
    expect(contentSchema.safeParse(ok).success).toBe(true)
    expect(contentSchema.safeParse({ ...ok, api_key: ' ' }).success).toBe(false)
    expect(contentSchema.safeParse({ ...ok, model: 'gpt-4' }).success).toBe(false)
    expect(contentSchema.safeParse({ ...ok, seller_monthly_token_limit: -1 }).success).toBe(false)
    expect(contentSchema.safeParse({ ...ok, seller_monthly_token_limit: 1.5 }).success).toBe(false)
    expect(contentSchema.safeParse({ ...ok, seller_monthly_token_limit: 0 }).success).toBe(true)
  })

  it('translation settings reject an unknown model and an empty key', () => {
    const ok = { enabled: false, model: 'gemini-3.1-flash-lite', api_key: 'k' }
    expect(translateSchema.safeParse(ok).success).toBe(true)
    expect(translateSchema.safeParse({ ...ok, model: 'gemini-3-deep-think' }).success).toBe(false)
    expect(translateSchema.safeParse({ ...ok, api_key: '' }).success).toBe(false)
  })

  it('a prompt must keep exactly its {variables} (AEC only warned)', () => {
    const original = 'Name {product_name} in {language}. {prompt_fields} {product_name}'
    expect(promptVariables(original).sort()).toEqual(['language', 'product_name', 'prompt_fields'])
    expect(sameVariables('{language} {prompt_fields} {product_name}!', original)).toBe(true)
    const schema = promptSchema(original)
    expect(schema.safeParse({ prompt: 'Write about {product_name}, {language}, {prompt_fields}' }).success).toBe(true)
    expect(schema.safeParse({ prompt: 'Write about {product_name}' }).success).toBe(false)
    expect(schema.safeParse({ prompt: '{product_name} {language} {prompt_fields} {extra}' }).success).toBe(false)
    expect(schema.safeParse({ prompt: '  ' }).success).toBe(false)
  })
})

describe('ai mock reads and writes', () => {
  it('settings never expose keys; saving with the mask keeps the key, a new value replaces it', () => {
    const before = get('/settings').data as unknown as { content: Row; translate: Row }
    expect(before.content.api_key).toBe(SECRET_MASK)
    expect(before.translate.api_key).toBe(SECRET_MASK)

    write('PUT', '/settings/content', { ...before.content, seller_monthly_token_limit: 777 })
    const after = get('/settings').data as unknown as { content: Row }
    expect(after.content).toMatchObject({ seller_monthly_token_limit: 777, api_key: SECRET_MASK })

    write('PUT', '/settings/translate', { enabled: true, model: 'gemini-2.5-flash', api_key: 'brand-new' })
    expect((get('/settings').data as unknown as { translate: Row }).translate.api_key).toBe(SECRET_MASK)
  })

  it('prompt edits are visible on the next read', () => {
    const [first] = get('/prompts').data
    write('PUT', '/prompts/:id', { prompt: 'Changed {product_name}' }, [String(first.id)])
    expect(get('/prompts').data[0].prompt).toBe('Changed {product_name}')
  })

  it('usage: `{data, meta, stats}`, newest first, server sort and paging', () => {
    const page = get('/usage', { kind: 'content', sort: '-created_at' })
    expect(page.meta!.total).toBeGreaterThanOrEqual(10)
    expect(page.data).toHaveLength(10)
    const dates = get('/usage', { kind: 'content', sort: '-created_at', ...all }).data.map((r) => String(r.created_at))
    expect(dates).toEqual([...dates].sort().reverse())
    const sorted = get('/usage', { kind: 'content', sort: 'total_tokens', ...all }).data.map((r) => Number(r.total_tokens))
    expect(sorted).toEqual([...sorted].sort((a, b) => a - b))
    expect(get('/usage', { kind: 'content', page: '2' }).data[0].id).not.toBe(page.data[0].id)
  })

  it('usage stats follow the date filter and only translation rows have language / translated counts', () => {
    const everything = get('/usage', { kind: 'content', ...all })
    expect(everything.stats!.requests).toBe(everything.meta!.total)
    expect(everything.stats!.tokens).toBe(everything.data.reduce((sum, r) => sum + Number(r.total_tokens), 0))
    expect(everything.stats!.avg_tokens).toBe(Math.round(everything.stats!.tokens / everything.stats!.requests))

    const one = get('/usage', { kind: 'content', from: '2099-01-01', ...all })
    expect(one.data).toHaveLength(0)
    expect(one.stats).toMatchObject({ requests: 0, tokens: 0, avg_tokens: 0 })

    const day = String(everything.data[0].created_at).slice(0, 10)
    const same = get('/usage', { kind: 'content', from: day, to: day, ...all })
    expect(same.data.length).toBeGreaterThan(0)
    expect(same.data.every((r) => String(r.created_at).startsWith(day))).toBe(true)

    const translation = get('/usage', { kind: 'translation', ...all })
    expect(translation.data.every((r) => r.language && Number(r.translated_count) > 0)).toBe(true)
    expect(translation.stats!.translations).toBe(translation.data.reduce((sum, r) => sum + Number(r.translated_count), 0))
    expect(everything.data.every((r) => r.language === null)).toBe(true)
  })

  it('translating fills only empty strings, one page at a time, and logs usage for the AI engine', () => {
    const lang = () => (get('/translate/languages').data as unknown as Row[]).find((l) => l.id === 3)!
    const before = Number(lang().translated_keys)
    const total = Number(lang().total_keys)
    const logs = get('/usage', { kind: 'translation', ...all }).meta!.total

    const res = write('POST', '/translate/:id', { engine: 'ai', page: 1 }, ['3']).data as unknown as Row
    expect(res).toMatchObject({ state: 'ok', page: 1, total_pages: Math.ceil(total / 50) })
    expect(res.translated_count).toBe(50)
    expect(Number(lang().translated_keys)).toBe(before + 50)
    expect(get('/usage', { kind: 'translation', ...all }).meta!.total).toBe(logs + 1)

    // never more than what is missing, never above the total
    for (let i = 0; i < 10; i++) write('POST', '/translate/:id', { engine: 'google', page: i + 1 }, ['3'])
    expect(Number(lang().translated_keys)).toBe(total)
    const done = write('POST', '/translate/:id', { engine: 'google', page: 1 }, ['3']).data as unknown as Row
    expect(done.translated_count).toBe(0)
    expect(get('/usage', { kind: 'translation', ...all }).meta!.total).toBe(logs + 1)
  })

  it('AI translation answers a reason instead of translating when it is switched off or has no key', () => {
    const current = (get('/settings').data as unknown as { translate: Row }).translate
    write('PUT', '/settings/translate', { ...current, enabled: false })
    expect((write('POST', '/translate/:id', { engine: 'ai', page: 1 }, ['4']).data as unknown as Row).state).toBe('disabled')
    // Google does not need the AI switch
    expect((write('POST', '/translate/:id', { engine: 'google', page: 1 }, ['4']).data as unknown as Row).state).toBe('ok')
    write('PUT', '/settings/translate', { ...current, enabled: true })
    expect((write('POST', '/translate/:id', { engine: 'ai', page: 1 }, ['4']).data as unknown as Row).state).toBe('ok')
  })
})
