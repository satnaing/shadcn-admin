import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import {
  DEFAULT_LANGUAGE,
  LANGUAGE_STORAGE_KEY,
  namespaces,
  supportedLanguages,
} from './config'
import enUS from './locales/en-US'
import zhCN from './locales/zh-CN'

/**
 * Resolve the initial language.
 * Strategy: forced default Chinese — only a previously stored user choice is
 * honoured, the browser language is intentionally NOT auto-detected.
 */
function detectInitialLanguage(): string {
  if (typeof window === 'undefined') return DEFAULT_LANGUAGE
  try {
    const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY)
    if (stored && supportedLanguages.some((l) => l.code === stored)) {
      return stored
    }
  } catch {
    /* localStorage unavailable — fall back to default */
  }
  return DEFAULT_LANGUAGE
}

/** Switch language, persist the preference and sync <html lang>. */
export function setLanguage(code: string): void {
  void i18n.changeLanguage(code)
  try {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, code)
  } catch {
    /* ignore persistence errors */
  }
  if (typeof document !== 'undefined') {
    document.documentElement.lang = code
  }
}

void i18n.use(initReactI18next).init({
  resources: {
    'zh-CN': zhCN,
    'en-US': enUS,
  },
  lng: detectInitialLanguage(),
  fallbackLng: DEFAULT_LANGUAGE,
  defaultNS: 'common',
  ns: [...namespaces],
  interpolation: { escapeValue: false },
  returnNull: false,
})

if (typeof document !== 'undefined') {
  document.documentElement.lang = i18n.language
}

export default i18n
