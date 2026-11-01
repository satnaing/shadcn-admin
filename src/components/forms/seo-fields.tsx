import type { FieldValues, Path, UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

type SeoFieldsProps<T extends FieldValues> = {
  form: UseFormReturn<T>
  /**
   * When set (e.g. `translations.az`), fields bind to
   * `{namePrefix}.meta_title|meta_description|og_image`.
   */
  namePrefix?: string
  className?: string
}

function fieldName<T extends FieldValues>(
  namePrefix: string | undefined,
  key: 'meta_title' | 'meta_description' | 'og_image'
): Path<T> {
  return (namePrefix ? `${namePrefix}.${key}` : key) as Path<T>
}

export function SeoFields<T extends FieldValues>({
  form,
  namePrefix,
  className,
}: SeoFieldsProps<T>) {
  const { t } = useTranslation('common')

  return (
    <div className={className ?? 'grid max-w-xl gap-4'}>
      <div>
        <h3 className='text-sm font-medium'>{t('seo.title')}</h3>
        <p className='text-xs text-muted-foreground'>{t('seo.description')}</p>
      </div>

      <FormField
        name={fieldName<T>(namePrefix, 'meta_title')}
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('seo.metaTitle')}</FormLabel>
            <FormControl>
              <Input
                placeholder={t('seo.metaTitlePlaceholder')}
                {...field}
                value={(field.value as string | undefined) ?? ''}
                className='h-11 w-full'
              />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        name={fieldName<T>(namePrefix, 'meta_description')}
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('seo.metaDescription')}</FormLabel>
            <FormControl>
              <Textarea
                placeholder={t('seo.metaDescriptionPlaceholder')}
                {...field}
                value={(field.value as string | undefined) ?? ''}
                rows={3}
                className='w-full'
              />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        name={fieldName<T>(namePrefix, 'og_image')}
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('seo.ogImage')}</FormLabel>
            <FormControl>
              <Input
                placeholder={t('seo.ogImagePlaceholder')}
                {...field}
                value={(field.value as string | undefined) ?? ''}
                className='h-11 w-full'
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  )
}
