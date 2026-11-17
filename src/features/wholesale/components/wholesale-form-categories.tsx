import type { UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { FormSectionCard } from '@/components/forms/form-section-card'
import { FormSelectField } from '@/components/forms/form-select-field'
import type { ProductFormValues } from '../data/wholesale.schema'
import { useWholesaleLookups } from '../hooks/use-wholesale'

/** Several categories (AEC `category_ids[]`) plus one main category that must be among them. */
export function WholesaleFormCategories({
  form,
}: {
  form: UseFormReturn<ProductFormValues>
}) {
  const { t } = useTranslation('wholesale')
  const { data } = useWholesaleLookups()
  const categories = data?.data.categories ?? []
  const ids = form.watch('category_ids')
  const error = form.formState.errors.category_ids?.message

  const toggle = (id: number, on: boolean) => {
    const next = on ? [...ids, id] : ids.filter((x) => x !== id)
    form.setValue('category_ids', next, {
      shouldDirty: true,
      shouldValidate: true,
    })
    // keep the main category inside the selection
    if (!next.includes(form.getValues('category_id')))
      form.setValue('category_id', next[0] ?? 0, { shouldValidate: true })
  }

  return (
    <FormSectionCard
      title={t('form.categories')}
      description={t('form.categoriesHint')}
    >
      <div className='grid gap-2 sm:grid-cols-2'>
        {categories.map((c) => (
          <Label key={c.id} className='flex items-center gap-2 font-normal'>
            <Checkbox
              checked={ids.includes(c.id)}
              onCheckedChange={(v) => toggle(c.id, v === true)}
            />
            {c.name}
          </Label>
        ))}
      </div>
      {typeof error === 'string' && (
        <p className='text-sm text-destructive'>
          {t(error.replace('wholesale:', ''))}
        </p>
      )}
      <FormSelectField
        form={form}
        name='category_id'
        numeric
        label={t('form.mainCategory')}
        options={categories
          .filter((c) => ids.includes(c.id))
          .map((c) => ({ value: String(c.id), label: c.name }))}
      />
    </FormSectionCard>
  )
}
