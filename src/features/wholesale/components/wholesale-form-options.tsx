import type { UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { FormImageField } from '@/components/forms/form-image-field'
import { FormInputField } from '@/components/forms/form-input-field'
import { FormSectionCard } from '@/components/forms/form-section-card'
import { FormSelectField } from '@/components/forms/form-select-field'
import { FormSwitchField } from '@/components/forms/form-switch-field'
import { FormTextareaField } from '@/components/forms/form-textarea-field'
import type { ProductFormValues } from '../data/wholesale.schema'

const FLAGS = [
  'is_published',
  'is_featured',
  'is_todays_deal',
  'cash_on_delivery',
  'is_quantity_multiplied',
] as const

type Props = { form: UseFormReturn<ProductFormValues> }

/** Shipping, visibility switches and SEO of the product. */
export function WholesaleFormOptions({ form }: Props) {
  const { t } = useTranslation('wholesale')
  const flat = form.watch('shipping_type') === 'flat'

  return (
    <>
      <FormSectionCard title={t('form.shipping')}>
        <div className='grid gap-4 md:grid-cols-2'>
          <FormSelectField
            form={form}
            name='shipping_type'
            label={t('form.shippingType')}
            options={['free', 'flat'].map((v) => ({
              value: v,
              label: t(`form.shippingTypes.${v}`),
            }))}
          />
          {flat && (
            <FormInputField
              form={form}
              name='shipping_cost'
              type='number'
              label={t('form.shippingCost')}
            />
          )}
          <FormInputField
            form={form}
            name='est_shipping_days'
            type='number'
            label={t('form.shippingDays')}
          />
        </div>
      </FormSectionCard>
      <FormSectionCard title={t('form.options')}>
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
      </FormSectionCard>
      <FormSectionCard title={t('form.seo')}>
        <FormInputField
          form={form}
          name='meta_title'
          label={t('form.metaTitle')}
        />
        <FormTextareaField
          form={form}
          name='meta_description'
          label={t('form.metaDescription')}
          rows={3}
        />
        <FormImageField
          form={form}
          name='meta_image'
          label={t('form.metaImage')}
        />
      </FormSectionCard>
    </>
  )
}
