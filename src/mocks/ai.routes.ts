import { maskSecret, mergeSecret, normalizeTranslateModel } from '@/features/ai/data/ai.models'
import {
  SECRET_MASK,
  type ContentAiSettings,
  type LanguageProgress,
  type TranslateAiSettings,
  type TranslateEngine,
  type UsageRow,
} from '@/features/ai/data/ai.type'
import { PAGE_SIZE, seedContentUsage, seedLanguages, seedPrompts, seedSettings, seedTranslationUsage } from './ai.data'
import { createCollection, type Handler, paginate } from './helpers'

const P = '/admin/ai'
const body = <T>(b: unknown) => (b ?? {}) as T
const ok = { message: 'ok' }
const settings = { content: { ...seedSettings.content }, translate: { ...seedSettings.translate } }
const prompts = createCollection(seedPrompts)
const contentUsage = createCollection(seedContentUsage)
const translationUsage = createCollection(seedTranslationUsage)
const languages: LanguageProgress[] = seedLanguages.map((l) => ({ ...l }))

/** Inclusive day filter on `created_at` (`YYYY-MM-DD`), like AEC's date range. */
const inRange = (row: UsageRow, from?: string, to?: string) => {
  const day = row.created_at.slice(0, 10)
  return (!from || day >= from) && (!to || day <= to)
}

const usage: Handler = (ctx) => {
  const { kind, from, to } = ctx.query
  const source = kind === 'translation' ? translationUsage : contentUsage
  const rows = source.all().filter((r) => inRange(r, from, to))
  const tokens = rows.reduce((sum, r) => sum + r.total_tokens, 0)
  const page = paginate(() => rows.map((r) => ({ ...r })) as unknown as Record<string, unknown>[])(ctx) as object

  return {
    ...page,
    stats: {
      requests: rows.length,
      tokens,
      avg_tokens: rows.length ? Math.round(tokens / rows.length) : 0,
      translations: rows.reduce((sum, r) => sum + (r.translated_count ?? 0), 0),
    },
  }
}

const translatePage: Handler = ({ params, body: b }) => {
  const { engine, page } = body<{ engine: TranslateEngine; page: number }>(b)
  const language = languages.find((l) => String(l.id) === params[0])
  const total_pages = Math.ceil((language?.total_keys ?? PAGE_SIZE) / PAGE_SIZE)
  // AEC answered `result:false` with a message instead of an HTTP error
  if (engine === 'ai' && !settings.translate.enabled) return { data: { state: 'disabled', translated_count: 0, page, total_pages } }
  if (engine === 'ai' && !settings.translate.api_key) return { data: { state: 'no_key', translated_count: 0, page, total_pages } }
  if (!language) return { data: { state: 'ok', translated_count: 0, page, total_pages: 1 } }

  // never overwrites: only the still-empty strings are filled, at most one page worth
  const filled = Math.min(PAGE_SIZE, language.total_keys - language.translated_keys)
  language.translated_keys += filled
  if (filled > 0 && engine === 'ai') {
    translationUsage.create(
      {
        created_at: new Date().toISOString(),
        user: 'Admin',
        model: settings.translate.model,
        prompt_tokens: filled * 40,
        completion_tokens: filled * 35,
        total_tokens: filled * 75,
        language: language.name,
        translated_count: filled,
      },
      'start'
    )
  }
  return { data: { state: 'ok', translated_count: filled, page, total_pages } }
}

const routes: Record<string, Handler> = {
  [`GET ${P}/settings`]: () => ({
    data: {
      content: { ...settings.content, api_key: maskSecret(settings.content.api_key, SECRET_MASK) },
      translate: {
        ...settings.translate,
        model: normalizeTranslateModel(settings.translate.model),
        api_key: maskSecret(settings.translate.api_key, SECRET_MASK),
      },
    },
  }),
  [`PUT ${P}/settings/content`]: ({ body: b }) => {
    const v = body<ContentAiSettings>(b)
    settings.content = { ...v, api_key: mergeSecret(settings.content.api_key, v.api_key, SECRET_MASK) }
    return ok
  },
  [`PUT ${P}/settings/translate`]: ({ body: b }) => {
    const v = body<TranslateAiSettings>(b)
    settings.translate = { ...v, api_key: mergeSecret(settings.translate.api_key, v.api_key, SECRET_MASK) }
    return ok
  },

  [`GET ${P}/prompts`]: () => ({ data: prompts.all().map((p) => ({ ...p })) }),
  [`PUT ${P}/prompts/:id`]: ({ params, body: b }) => {
    prompts.update(params[0], { prompt: body<{ prompt: string }>(b).prompt })
    return ok
  },

  [`GET ${P}/usage`]: usage,

  [`GET ${P}/translate/languages`]: () => ({ data: languages.map((l) => ({ ...l })) }),
  [`POST ${P}/translate/:id`]: translatePage,
}

export default routes
