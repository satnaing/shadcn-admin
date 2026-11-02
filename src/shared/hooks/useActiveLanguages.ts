import { FALLBACK_FORM_LOCALES } from '@/shared/constants/locales'

/** Dil siyahısı hələ `settings` API-sindən gəlmir — `01-settings` bitəndə serverdən oxunacaq. */
export function useActiveLanguages() {
  return {
    locales: [...FALLBACK_FORM_LOCALES],
    defaultLocale: FALLBACK_FORM_LOCALES[0],
    isLoading: false,
  }
}
