/** Secret values come back as this mask; sending the mask unchanged keeps the stored secret. */
export const SECRET_MASK = '********'

/** AEC "Google AI (Gemini) Settings": product content generation (`ai_activation`, `gemini_model`, `GEMINI_API_KEY`, `seller_monthly_token_limit`). */
export interface ContentAiSettings {
  enabled: boolean
  model: string
  api_key: string
  /** Tokens a seller may spend per month; admins are unlimited. */
  seller_monthly_token_limit: number
}

/** AEC addon `ai_translate` config (`ai_translate_activation`, `gemini_translate_model`, `GEMINI_TRANSLATE_API_KEY`). */
export interface TranslateAiSettings {
  enabled: boolean
  model: string
  api_key: string
}

export interface AiSettings {
  content: ContentAiSettings
  translate: TranslateAiSettings
}

export interface PromptItem {
  id: number
  identifier: string
  prompt: string
}

export type UsageKind = 'content' | 'translation'

export interface UsageStats {
  requests: number
  tokens: number
  avg_tokens: number
  /** Translation log only. */
  translations: number
}

export interface UsageRow {
  id: number
  created_at: string
  user: string | null
  model: string
  prompt_tokens: number
  completion_tokens: number
  total_tokens: number
  /** Translation log only. */
  language: string | null
  translated_count: number | null
}

export interface UsageListParams {
  kind: UsageKind
  page?: number
  per_page?: number
  sort?: string
  from?: string
  to?: string
}

export type TranslateEngine = 'ai' | 'google'

export interface LanguageProgress {
  id: number
  code: string
  name: string
  total_keys: number
  translated_keys: number
}

export interface TranslateResult {
  /** `disabled` / `no_key`: AEC answered `result:false` with a message; the run stops. */
  state: 'ok' | 'disabled' | 'no_key'
  translated_count: number
  page: number
  total_pages: number
}
