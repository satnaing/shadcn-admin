import type { UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { FormInputField } from '@/components/forms/form-input-field'
import { FormSectionCard } from '@/components/forms/form-section-card'
import { FormSelectField } from '@/components/forms/form-select-field'
import type { ProductFormValues } from '../data/wholesale.schema'

const TYPES = ['flat', 'percent'] as const
const VISIBILITY = ['quantity', 'text', 'hidden'] as const

type Props = { form: UseFormReturn<ProductFormValues> }

/** Base (retail) price, optional discount window and stock; the wholesale bands are their own card. */
export function WholesaleFormPricing({ form }: Props) {
  const { t } = useTranslation('wholesale')

  return (
    <>
      <FormSectionCard
        title={t('form.pricing')}
        description={t('form.pricingHint')}
      >
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
            options={TYPES.map((v) => ({
              value: v,
              label: t(`form.type.${v}`),
            }))}
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
      </FormSectionCard>
      <FormSectionCard title={t('form.stock')}>
        <div className='grid gap-4 md:grid-cols-2'>
          <FormInputField
            form={form}
            name='current_stock'
            type='number'
            label={t('form.currentStock')}
          />
          <FormInputField form={form} name='sku' label={t('form.sku')} />
          <FormInputField
            form={form}
            name='low_stock_quantity'
            type='number'
            label={t('form.lowStock')}
            hint={t('form.lowStockHint')}
          />
          <FormSelectField
            form={form}
            name='stock_visibility'
            label={t('form.stockVisibility')}
            options={VISIBILITY.map((v) => ({
              value: v,
              label: t(`form.visibility.${v}`),
            }))}
          />
        </div>
      </FormSectionCard>
    </>
  )
}
