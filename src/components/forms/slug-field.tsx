import {
  type FieldValues,
  type Path,
  type UseFormReturn,
  useWatch,
} from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

const CANONICAL_LOCALE = 'en'

interface SlugFieldProps<T extends FieldValues> {
  form: UseFormReturn<T>
  /** Active language tab — only EN is editable; others mirror EN. */
  locale: string
  label: string
  placeholder?: string
  className?: string
}

/**
 * English-only slug: editors set the path on the EN tab; other locale tabs show a
 * read-only copy. Auto-generation + cross-locale mirroring live in the always
 * mounted `useEnglishSlugSync` hook (this component is only the UI, so it works
 * even while a non-EN tab is active).
 */
export function SlugField<T extends FieldValues>({
  form,
  locale,
  label,
  placeholder,
  className,
}: SlugFieldProps<T>) {
  const { t } = useTranslation('common')
  const isCanonical = locale === CANONICAL_LOCALE

  const name = `translations.${locale}.slug` as Path<T>
  const enSlugName = `translations.${CANONICAL_LOCALE}.slug` as Path<T>
  const slug = useWatch({ control: form.control, name: enSlugName })
  const current = typeof slug === 'string' ? slug : ''

  if (!isCanonical) {
    return (
      <FormItem className={className}>
        <FormLabel>{label}</FormLabel>
        <FormControl>
          <Input
            value={current}
            readOnly
            disabled
            className='h-11 w-full'
            placeholder={placeholder}
          />
        </FormControl>
        <FormDescription>{t('slug.englishOnly')}</FormDescription>
      </FormItem>
    )
  }

  return (
    <FormField
      name={name}
      control={form.control}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>
            {label} <span className='text-red-500'>*</span>
          </FormLabel>
          <FormControl>
            <Input
              placeholder={placeholder}
              {...field}
              value={(field.value as string | undefined) ?? ''}
              className='h-11 w-full'
            />
          </FormControl>
          <FormDescription>{t('slug.autoHintEnglish')}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
