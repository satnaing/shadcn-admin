import { enUS, zhCN } from 'date-fns/locale'
import { useTranslation } from 'react-i18next'

/** Map an app language code to the matching date-fns locale. */
export function getDateFnsLocale(language: string) {
  return language === 'en-US' ? enUS : zhCN
}

/** React hook returning the date-fns locale for the active language. */
export function useDateLocale() {
  const { i18n } = useTranslation()
  return getDateFnsLocale(i18n.language)
}
