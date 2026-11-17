import { useFieldArray, type UseFormReturn } from 'react-hook-form'
import { Plus, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { FormInputField } from '@/components/forms/form-input-field'
import { FormSectionCard } from '@/components/forms/form-section-card'
import type { ProductFormValues } from '../data/wholesale.schema'

/** Quantity bands (AEC `wholesale_min_qty[]`, `wholesale_max_qty[]`, `wholesale_price[]`). */
export function WholesaleFormTiers({
  form,
}: {
  form: UseFormReturn<ProductFormValues>
}) {
  const { t } = useTranslation('wholesale')
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'tiers',
  })
  const last = fields.length
    ? form.getValues(`tiers.${fields.length - 1}`)
    : null
  const error =
    form.formState.errors.tiers?.root?.message ??
    form.formState.errors.tiers?.message

  return (
    <FormSectionCard title={t('form.tiers')} description={t('form.tiersHint')}>
      {fields.map((field, i) => (
        <div
          key={field.id}
          className='grid items-end gap-3 md:grid-cols-[1fr_1fr_1fr_auto]'
        >
          <FormInputField
            form={form}
            name={`tiers.${i}.min_qty`}
            type='number'
            label={t('form.tierMin')}
          />
          <FormInputField
            form={form}
            name={`tiers.${i}.max_qty`}
            type='number'
            label={t('form.tierMax')}
          />
          <FormInputField
            form={form}
            name={`tiers.${i}.price`}
            type='number'
            label={t('form.tierPrice')}
          />
          <Button
            type='button'
            variant='ghost'
            size='icon'
            aria-label={t('actions.remove')}
            disabled={fields.length === 1}
            onClick={() => remove(i)}
          >
            <Trash2 className='size-4' />
          </Button>
        </div>
      ))}
      {typeof error === 'string' && (
        <p className='text-sm text-destructive'>
          {t(error.replace('wholesale:', ''))}
        </p>
      )}
      <Button
        type='button'
        variant='outline'
        size='sm'
        onClick={() =>
          append({
            min_qty: (last?.max_qty ?? 0) + 1,
            max_qty: (last?.max_qty ?? 0) + 10,
            price: 0,
          })
        }
      >
        <Plus className='me-2 size-4' />
        {t('form.addTier')}
      </Button>
    </FormSectionCard>
  )
}
