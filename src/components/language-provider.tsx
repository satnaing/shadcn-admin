import { createContext, useContext, useState } from 'react'
import { IntlProvider } from 'use-intl'
import translations from '../translations'

export type Language = 'en' | 'zh'

type LanguageProviderProps = {
  children: React.ReactNode
  defaultLanguage?: Language
  storageKey?: string
}

type LanguageProviderState = {
  language: Language
  setLanguage: (lang: Language) => void
}

const initialState: LanguageProviderState = {
  language: 'en',
  setLanguage: () => null,
}

const LanguageProviderContext =
  createContext<LanguageProviderState>(initialState)

export function LanguageProvider({
  children,
  defaultLanguage = 'en',
  storageKey = 'vite-ui-language',
  ...props
}: LanguageProviderProps) {
  const [language, setLanguage] = useState<Language>(
    () => (localStorage.getItem(storageKey) as Language) || defaultLanguage
  )

  const value = {
    language,
    setLanguage: (lang: Language) => {
      localStorage.setItem(storageKey, lang)
      setLanguage(lang)
    },
  }

  return (
    <LanguageProviderContext.Provider {...props} value={value}>
      <IntlProvider locale={language} messages={translations[language]}>
        {children}
      </IntlProvider>
    </LanguageProviderContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useLanguage = () => {
  const context = useContext(LanguageProviderContext)

  if (context === undefined)
    throw new Error('useLanguage must be used within a LanguageProvider')

  return context
}
