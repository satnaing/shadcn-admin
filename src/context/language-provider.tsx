import { createContext, useContext, useEffect, useState } from 'react'
import { getCookie, setCookie, removeCookie } from '@/lib/cookies'
import i18n from '@/i18n'

type Language = 'en' | 'zh'

const DEFAULT_LANGUAGE: Language = 'en'
const LANGUAGE_COOKIE_NAME = 'language'
const LANGUAGE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365 // 1 year

type LanguageProviderProps = {
  children: React.ReactNode
  defaultLanguage?: Language
  storageKey?: string
}

type LanguageProviderState = {
  defaultLanguage: Language
  language: Language
  setLanguage: (language: Language) => void
  resetLanguage: () => void
}

const initialState: LanguageProviderState = {
  defaultLanguage: DEFAULT_LANGUAGE,
  language: DEFAULT_LANGUAGE,
  setLanguage: () => null,
  resetLanguage: () => null,
}

const LanguageContext = createContext<LanguageProviderState>(initialState)

export function LanguageProvider({
  children,
  defaultLanguage = DEFAULT_LANGUAGE,
  storageKey = LANGUAGE_COOKIE_NAME,
  ...props
}: LanguageProviderProps) {
  const [language, _setLanguage] = useState<Language>(
    () => (getCookie(storageKey) as Language) || defaultLanguage
  )

  useEffect(() => {
    const root = window.document.documentElement
    root.setAttribute('lang', language)
    i18n.changeLanguage(language)
  }, [language])

  const setLanguage = (language: Language) => {
    setCookie(storageKey, language, LANGUAGE_COOKIE_MAX_AGE)
    _setLanguage(language)
  }

  const resetLanguage = () => {
    removeCookie(storageKey)
    _setLanguage(DEFAULT_LANGUAGE)
  }

  const contextValue = {
    defaultLanguage,
    language,
    resetLanguage,
    setLanguage,
  }

  return (
    <LanguageContext value={contextValue} {...props}>
      {children}
    </LanguageContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useLanguage = () => {
  const context = useContext(LanguageContext)

  if (!context)
    throw new Error('useLanguage must be used within a LanguageProvider')

  return context
}
