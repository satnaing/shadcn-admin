/** Gemini models offered by AEC (`ai_config.blade` and the addon's `config.blade`). */
export const CONTENT_MODELS = [
  'gemini-3.1-pro-preview',
  'gemini-3.1-flash-lite-preview',
  'gemini-3-flash-preview',
  'gemini-3-deep-think',
  'gemini-2.5-pro',
  'gemini-2.5-flash',
  'gemini-2.5-flash-lite',
] as const

export const TRANSLATE_MODELS = [
  'gemini-2.5-flash',
  'gemini-2.5-flash-lite',
  'gemini-3.1-flash-lite',
  'gemini-3-flash-preview',
  'gemini-2.5-pro',
] as const

/** i18n key of a model label: dots would be read as nesting by i18next. */
export const modelKey = (model: string) => `models.${model.replace(/\./g, '_')}`

/** AEC silently rewrote retired models when saving/using; the API does the same on read. */
export const TRANSLATE_DEFAULT_MODEL = 'gemini-2.5-flash'
const RETIRED = ['gemini-2.0-flash', 'gemini-2.0-flash-lite', '']
export const normalizeTranslateModel = (model: string) => (RETIRED.includes(model) ? TRANSLATE_DEFAULT_MODEL : model)

/** Variables of a prompt (`{product_name}`): they must survive an edit. */
export const promptVariables = (text: string): string[] => [
  ...new Set([...text.matchAll(/\{\s*([a-z_]+)\s*\}/g)].map((m) => m[1])),
]

const sameSet = (a: string[], b: string[]) => a.length === b.length && a.every((x) => b.includes(x))
export const sameVariables = (a: string, b: string) => sameSet(promptVariables(a), promptVariables(b))

export const maskSecret = (value: string, mask: string) => (value ? mask : '')
export const mergeSecret = (stored: string, incoming: string, mask: string) => (incoming === mask ? stored : incoming)
