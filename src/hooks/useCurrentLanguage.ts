import { useTranslation } from 'react-i18next'

export function useCurrentLanguage() {
  const { i18n } = useTranslation()

  const language =
    i18n.resolvedLanguage ||
    (i18n.language ? i18n.language.split('-')[0] : 'en')

  return language
}
