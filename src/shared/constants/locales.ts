import type { Locale } from '@/shared/types'

/** Admin chrome i18n switcher only — not content form tabs. */
export const LOCALE_OPTIONS = [
  { code: 'az', flag: '🇦🇿', label: 'Azərbaycan' },
  { code: 'en', flag: '🇬🇧', label: 'English' },
  { code: 'tr', flag: '🇹🇷', label: 'Türkçe' },
] as const satisfies ReadonlyArray<{
  code: Locale
  flag: string
  label: string
}>

export const ADMIN_UI_LOCALES = LOCALE_OPTIONS.map((item) => item.code)

/** Fallback when GET /languages fails or returns empty. Default = az first. */
export const FALLBACK_FORM_LOCALES = ['az', 'en', 'tr'] as const

/** @deprecated Use useActiveLanguages / LocaleFormTabs — kept for rare static imports */
export const FORM_LOCALES = FALLBACK_FORM_LOCALES

export function getLocaleOption(code: string) {
  return (
    LOCALE_OPTIONS.find((option) => option.code === code) ?? LOCALE_OPTIONS[0]
  )
}

export type ActiveLanguage = {
  code: string
  name: string
  is_default: boolean
  is_default_admin: boolean
  sort: number
}

export function sortActiveLanguages(
  languages: ActiveLanguage[]
): ActiveLanguage[] {
  return [...languages].sort((a, b) => {
    if (a.is_default !== b.is_default) {
      return a.is_default ? -1 : 1
    }
    if (a.sort !== b.sort) {
      return a.sort - b.sort
    }
    return a.code.localeCompare(b.code)
  })
}

export function defaultFormLocale(languages: ActiveLanguage[]): string {
  const sorted = sortActiveLanguages(languages)
  const preferred = sorted.find((item) => item.is_default) ?? sorted[0]
  return preferred?.code ?? FALLBACK_FORM_LOCALES[0]
}

export function defaultAdminLocale(languages: ActiveLanguage[]): string {
  const preferred =
    languages.find((item) => item.is_default_admin) ??
    languages.find((item) => item.is_default) ??
    languages[0]
  return preferred?.code ?? FALLBACK_FORM_LOCALES[0]
}
