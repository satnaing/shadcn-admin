import { buildListQueryString } from '@/shared/utils/list-query-string'
import { api } from '@/api/client'
import { ENDPOINTS } from '@/api/endpoints'
import type { ApiMessageResponse, ApiPaginatedResponse, ApiResponse } from '@/api/types'
import type {
  AiSettings,
  ContentAiSettings,
  LanguageProgress,
  PromptItem,
  TranslateAiSettings,
  TranslateEngine,
  TranslateResult,
  UsageListParams,
  UsageRow,
  UsageStats,
} from '@/features/ai/data/ai.type'

const E = ENDPOINTS.AI

export const aiApi = {
  settings: () => api.get<ApiResponse<AiSettings>>(E.SETTINGS),
  saveContent: (values: ContentAiSettings) => api.put<ApiMessageResponse>(E.CONTENT_SETTINGS, values),
  saveTranslate: (values: TranslateAiSettings) => api.put<ApiMessageResponse>(E.TRANSLATE_SETTINGS, values),

  prompts: () => api.get<ApiResponse<PromptItem[]>>(E.PROMPTS),
  savePrompt: (id: number, prompt: string) => api.put<ApiMessageResponse>(E.PROMPT(id), { prompt }),

  usage: (params: UsageListParams) =>
    api.get<ApiPaginatedResponse<UsageRow[]> & { stats: UsageStats }>(`${E.USAGE}?${buildListQueryString({ ...params })}`),

  languages: () => api.get<ApiResponse<LanguageProgress[]>>(E.LANGUAGES),
  translatePage: (id: number, engine: TranslateEngine, page: number) =>
    api.post<ApiResponse<TranslateResult>>(E.TRANSLATE(id), { engine, page }),
}
