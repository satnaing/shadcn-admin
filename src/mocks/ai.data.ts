import type { AiSettings, LanguageProgress, PromptItem, UsageRow } from '@/features/ai/data/ai.type'

/** Secrets are stored unmasked here; the route masks them on the way out (API contract). */
export const seedSettings: AiSettings = {
  content: { enabled: true, model: 'gemini-2.5-flash', api_key: 'AIzaSy-content-key-7731', seller_monthly_token_limit: 50000 },
  translate: { enabled: true, model: 'gemini-2.5-flash', api_key: 'AIzaSy-translate-key-4410' },
}

/** AEC seeds one row (`sqlupdates/v1070.sql`): the product add/edit prompt. */
export const seedPrompts: PromptItem[] = [
  {
    id: 1,
    identifier: 'product_add_edit_prompt',
    prompt:
      'You are an expert e-commerce product assistant.\nProduct name: {product_name}\nTarget language: {language}\nGenerate realistic values only for:\n{prompt_fields}\nReturn ONLY a valid JSON object with exactly these keys, no markdown, no explanations.',
  },
]

const USERS = ['Admin', 'Aysel Mammadova', 'Rauf Aliyev', 'Leyla Hasanova', 'Murad Quliyev', 'Nigar Ismayilova']
const day = (i: number) => new Date(Date.UTC(2026, 10, 16 - Math.floor(i / 2), 6 + (i % 12), 10 * (i % 6))).toISOString()

/** 24 content generations. */
export const seedContentUsage: UsageRow[] = Array.from({ length: 24 }, (_, i) => {
  const prompt = 300 + ((i * 97) % 500)
  const completion = 150 + ((i * 53) % 400)
  return {
    id: i + 1,
    created_at: day(24 - i),
    user: USERS[i % USERS.length],
    model: i % 5 === 0 ? 'gemini-2.5-pro' : 'gemini-2.5-flash',
    prompt_tokens: prompt,
    completion_tokens: completion,
    total_tokens: prompt + completion,
    language: null,
    translated_count: null,
  }
})

/** 18 translation runs. */
export const seedTranslationUsage: UsageRow[] = Array.from({ length: 18 }, (_, i) => {
  const prompt = 1800 + ((i * 211) % 1500)
  const completion = 1500 + ((i * 137) % 1200)
  return {
    id: i + 1,
    created_at: day(18 - i),
    user: USERS[i % 3],
    model: i % 4 === 0 ? 'gemini-2.5-flash-lite' : 'gemini-2.5-flash',
    prompt_tokens: prompt,
    completion_tokens: completion,
    total_tokens: prompt + completion,
    language: ['Azerbaijani', 'Russian', 'Turkish'][i % 3],
    translated_count: 20 + ((i * 7) % 31),
  }
})

/** AEC pages the language strings 50 keys at a time. English is the source language, so it is not offered. */
export const PAGE_SIZE = 50
export const seedLanguages: LanguageProgress[] = [
  { id: 1, code: 'az', name: 'Azerbaijani', total_keys: 320, translated_keys: 318 },
  { id: 2, code: 'ru', name: 'Russian', total_keys: 320, translated_keys: 241 },
  { id: 3, code: 'tr', name: 'Turkish', total_keys: 320, translated_keys: 123 },
  { id: 4, code: 'ka', name: 'Georgian', total_keys: 320, translated_keys: 0 },
]
