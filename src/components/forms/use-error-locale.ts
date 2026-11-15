import { useState } from 'react'
import type { FieldErrors, FieldValues } from 'react-hook-form'
import { useActiveLanguages } from '@/shared/hooks/useActiveLanguages'
import type { Locale } from '@/shared/types'

/** On a failed submit, reopen the first language tab that holds an error (remount LocaleFormTabs with `key`). */
export function useErrorLocale() {
  const { locales } = useActiveLanguages()
  const [errorLocale, setErrorLocale] = useState<Locale | undefined>()

  const onInvalid = (errors: FieldErrors<FieldValues>) => {
    const translations = errors.translations as Record<string, unknown> | undefined
    const first = locales.find((locale) => translations?.[locale])
    if (first) setErrorLocale(first)
  }

  return { errorLocale, onInvalid }
}
