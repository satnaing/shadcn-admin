import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { EntityFormDialog } from '@/components/forms/entity-form-dialog'
import { LocaleFormTabs } from '@/components/forms/locale-form-tabs'
import { SlugField } from '@/components/forms/slug-field'
import { useEnglishSlugSync } from '@/components/forms/use-english-slug-sync'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import {
  type CategoryFormValues,
  categoryDefaults,
  categorySchema,
  categoryToForm,
} from '../data/blogs.schema'
import type { BlogCategoryDetail } from '../data/blogs.type'
import { useBlogMutations } from '../hooks/use-blog-mutations'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Loaded category when editing; `undefined` = create. Remount with `key`. */
  category?: BlogCategoryDetail
}

export function BlogCategoryDialog({ open, onOpenChange, category }: Props) {
  const { t } = useTranslation('blogs')
  const { createCategory, updateCategory } = useBlogMutations()
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: category ? categoryToForm(category) : categoryDefaults,
  })
  useEnglishSlugSync(form, 'name')

  const mutation = category ? updateCategory : createCategory
  const submit = form.handleSubmit((values) => {
    const onSuccess = () => onOpenChange(false)
    if (category) updateCategory.mutate({ id: category.id, values }, { onSuccess })
    else createCategory.mutate(values, { onSuccess })
  })

  return (
    <EntityFormDialog
      open={open}
      onOpenChange={onOpenChange}
      form={form}
      title={t(category ? 'categories.editTitle' : 'categories.createTitle')}
      description={t('categories.description')}
      isCreate={!category}
      isPending={mutation.isPending}
      labels={{
        saving: t('form.saving'),
        saveAndExit: t('form.save'),
        updating: t('form.saving'),
        updateAndExit: t('form.save'),
      }}
      onSubmit={submit}
      contentClassName='sm:max-w-lg'
    >
      <LocaleFormTabs>
        {(locale) => (
          <div className='space-y-4'>
            <FormField
              control={form.control}
              name={`translations.${locale}.name` as 'translations.en.name'}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('categories.name')}</FormLabel>
                  <FormControl>
                    <Input className='h-11' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <SlugField form={form} locale={locale} label={t('form.slug')} />
          </div>
        )}
      </LocaleFormTabs>
      <FormField
        control={form.control}
        name='status'
        render={({ field }) => (
          <FormItem className='flex items-center justify-between rounded-md border p-3'>
            <FormLabel>{t('categories.active')}</FormLabel>
            <FormControl>
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
          </FormItem>
        )}
      />
    </EntityFormDialog>
  )
}
