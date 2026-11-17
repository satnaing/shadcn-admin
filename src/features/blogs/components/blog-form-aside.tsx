import { TagInput } from '@/components/shared/tag-input'
import { joinTags, splitTags } from '@/components/shared/tag-input.logic'
import type { UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ImagePicker } from '@/components/image-picker'
import type { BlogFormValues } from '../data/blogs.schema'
import { useBlogCategories } from '../hooks/use-blogs'

export function BlogFormAside({ form }: { form: UseFormReturn<BlogFormValues> }) {
  const { t } = useTranslation('blogs')
  const { data } = useBlogCategories({ per_page: 100 })
  const status = form.watch('status')

  return (
    <div className='space-y-4'>
      <FormField
        control={form.control}
        name='cover'
        render={({ field }) => (
          <FormItem>
            <ImagePicker label={t('form.cover')} value={field.value} onChange={field.onChange} />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name='category_id'
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('form.category')}</FormLabel>
            <Select
              value={field.value ? String(field.value) : ''}
              onValueChange={(v) => field.onChange(Number(v))}
            >
              <FormControl>
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder={t('form.categoryPlaceholder')} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {(data?.data ?? []).map((c) => (
                  <SelectItem key={c.id} value={String(c.id)}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name='tags'
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('form.tags')}</FormLabel>
            <FormControl>
              <TagInput
                placeholder={t('form.tagsPlaceholder')}
                value={splitTags(field.value)}
                onChange={(tags) => field.onChange(joinTags(tags))}
              />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name='status'
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('columns.status')}</FormLabel>
            <Select value={field.value} onValueChange={field.onChange}>
              <FormControl>
                <SelectTrigger className='w-full'>
                  <SelectValue />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {(['draft', 'published', 'scheduled'] as const).map((s) => (
                  <SelectItem key={s} value={s}>
                    {t(`status.${s}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />
      {status === 'scheduled' && (
        <FormField
          control={form.control}
          name='publish_at'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('form.publishAt')}</FormLabel>
              <FormControl>
                <Input type='datetime-local' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  )
}
