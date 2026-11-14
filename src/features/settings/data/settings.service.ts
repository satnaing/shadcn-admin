import { api } from '@/api/client'
import { ENDPOINTS } from '@/api/endpoints'
import type { ApiMessageResponse, ApiResponse } from '@/api/types'
import type { CurrencyFormValues } from './settings.schema'
import type {
  Currency,
  GroupValues,
  Language,
  LanguagePatch,
  SettingsGroup,
} from './settings.type'

export const settingsKeys = {
  group: (group: SettingsGroup) => ['SETTINGS', group] as const,
  languages: () => ['SETTINGS', 'languages'] as const,
  currencies: () => ['SETTINGS', 'currencies'] as const,
}

export const settingsService = {
  getGroup: (group: SettingsGroup) =>
    api.get<ApiResponse<GroupValues>>(ENDPOINTS.SETTINGS(group)),
  saveGroup: (group: SettingsGroup, values: GroupValues) =>
    api.put<ApiResponse<GroupValues>, GroupValues>(ENDPOINTS.SETTINGS(group), values),

  languages: () => api.get<ApiResponse<Language[]>>(ENDPOINTS.LANGUAGES.LIST),
  patchLanguage: (id: number, patch: LanguagePatch) =>
    api.patch<ApiResponse<Language>, LanguagePatch>(ENDPOINTS.LANGUAGES.ITEM(id), patch),

  currencies: () => api.get<ApiResponse<Currency[]>>(ENDPOINTS.CURRENCIES.LIST),
  createCurrency: (values: CurrencyFormValues) =>
    api.post<ApiResponse<Currency>, CurrencyFormValues>(ENDPOINTS.CURRENCIES.LIST, values),
  updateCurrency: (id: number, values: Partial<CurrencyFormValues> & { is_default?: boolean }) =>
    api.put<ApiResponse<Currency>, typeof values>(ENDPOINTS.CURRENCIES.ITEM(id), values),
  deleteCurrency: (id: number) => api.delete<ApiMessageResponse>(ENDPOINTS.CURRENCIES.ITEM(id)),
}
