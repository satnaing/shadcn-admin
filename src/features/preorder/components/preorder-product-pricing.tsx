import type { UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { FormInputField } from '@/components/forms/form-input-field'
import { FormSelectField } from '@/components/forms/form-select-field'
import { FormSwitchField } from '@/components/forms/form-switch-field'
import type { ProductFormValues } from '../data/preorder.schema'
import { PreorderFormSection } from './preorder-form-section'

const TYPES = ['flat', 'percent'] as const
const FLAGS = [
  'is_published',
  'is_featured',
  'is_show_on_homepage',
  'sample_order',
  'wholesale',
  'show_lead_time',
] as const

export function PreorderProductPricing({
  form,
}: {
  form: UseFormReturn<ProductFormValues>
}) {
  const { t } = useTranslation('preorder')
  const types = TYPES.map((v) => ({ value: v, label: t(`form.type.${v}`) }))

  return (
    <>
      <PreorderFormSection title={t('form.pricing')}>
        <div className='grid gap-4 md:grid-cols-2'>
          <FormInputField
            form={form}
            name='unit_price'
            type='number'
            label={t('form.unitPrice')}
          />
          <span />
          <FormSelectField
            form={form}
            name='discount_type'
            label={t('form.discountType')}
            options={types}
          />
          <FormInputField
            form={form}
            name='discount'
            type='number'
            label={t('form.discount')}
          />
          <FormInputField
            form={form}
            name='discount_start'
            type='datetime-local'
            label={t('form.discountStart')}
          />
          <FormInputField
            form={form}
            name='discount_end'
            type='datetime-local'
            label={t('form.discountEnd')}
          />
        </div>
      </PreorderFormSection>
      <PreorderFormSection title={t('form.options')}>
        <div className='grid gap-3 md:grid-cols-2'>
          {FLAGS.map((f) => (
            <FormSwitchField
              key={f}
              form={form}
              name={f}
              label={t(`form.flags.${f}`)}
            />
          ))}
        </div>
      </PreorderFormSection>
    </>
  )
}
