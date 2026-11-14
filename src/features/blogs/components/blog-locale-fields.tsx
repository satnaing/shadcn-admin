import type { UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { SeoFields } from '@/components/forms/seo-fields'
import { SlugField } from '@/components/forms/slug-field'
import type { BlogFormValues } from '../data/blogs.schema'

interface Props {
  form: UseFormReturn<BlogFormValues>
  locale: string
}

type TextKey = 'title' | 'short_description' | 'content'

export function BlogLocaleFields({ form, locale }: Props) {
  const { t } = useTranslation('blogs')
  const text = (key: TextKey, rows?: number) => (
    <FormField
      control={form.control}
      name={`translations.${locale}.${key}` as `translations.az.${TextKey}`}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t(`form.${key}`)}</FormLabel>
          <FormControl>
            {rows ? <Textarea rows={rows} {...field} /> : <Input className='h-11' {...field} />}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )

  return (
    <div className='space-y-4'>
      {text('title')}
      <SlugField form={form} locale={locale} label={t('form.slug')} />
      {text('short_description', 2)}
      {text('content', 12)}
      <SeoFields form={form} namePrefix={`translations.${locale}`} />
    </div>
  )
}
