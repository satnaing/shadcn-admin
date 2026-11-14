import { useEffect, useRef } from 'react'
import {
  type FieldValues,
  type Path,
  type PathValue,
  type UseFormReturn,
  useWatch,
} from 'react-hook-form'
import { slugify } from '@/shared/utils/slugger'
import { useActiveLanguages } from '@/shared/hooks/useActiveLanguages'

const CANONICAL_LOCALE = 'en'

/**
 * English-only slug, mounted once at the form-page level (not inside a locale
 * tab). Radix unmounts inactive tabs, so the old effect inside SlugField never
 * ran while editing/translating on a non-EN tab — that left EN/other slugs empty
 * and blocked save. Running here keeps the slug filled regardless of active tab
 * (e.g. after an AZ→EN/TR AI translate).
 */
export function useEnglishSlugSync<T extends FieldValues>(
  form: UseFormReturn<T>,
  titleKey = 'title'
) {
  const { locales } = useActiveLanguages()
  const enSlugName = `translations.${CANONICAL_LOCALE}.slug` as Path<T>
  const sourceName = `translations.${CANONICAL_LOCALE}.${titleKey}` as Path<T>

  const slug = useWatch({ control: form.control, name: enSlugName })
  const source = useWatch({ control: form.control, name: sourceName })
  const previousSourceRef = useRef<string | null>(null)

  const current = typeof slug === 'string' ? slug : ''
  const title = typeof source === 'string' ? source : ''

  /* Auto-generate from EN title while the EN slug still tracks the title. */
  useEffect(() => {
    const previousTitle = previousSourceRef.current
    previousSourceRef.current = title

    const next = slugify(title)
    if (next === '' || next === current) {
      return
    }

    const followsPreviousTitle =
      previousTitle !== null && current === slugify(previousTitle)

    if (current !== '' && !followsPreviousTitle) {
      return
    }

    form.setValue(enSlugName, next as PathValue<T, Path<T>>, {
      shouldDirty: true,
    })
  }, [current, title, form, enSlugName])

  /* Mirror EN slug onto every locale (URLs are not translated). */
  useEffect(() => {
    if (typeof slug !== 'string' || slug === '') return

    for (const code of locales) {
      if (code === CANONICAL_LOCALE) continue
      const path = `translations.${code}.slug` as Path<T>
      const existing = form.getValues(path)
      if (existing === slug) continue
      form.setValue(path, slug as PathValue<T, Path<T>>, { shouldDirty: true })
    }
  }, [slug, locales, form])
}
