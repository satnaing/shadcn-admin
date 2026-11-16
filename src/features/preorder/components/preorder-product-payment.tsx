import type { UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { FormInputField } from '@/components/forms/form-input-field'
import { FormSelectField } from '@/components/forms/form-select-field'
import { FormTextareaField } from '@/components/forms/form-textarea-field'
import type { ProductFormValues } from '../data/preorder.schema'
import { PreorderFormSection } from './preorder-form-section'
import { PreorderToggleBlock } from './preorder-toggle-block'

const TYPES = ['flat', 'percent'] as const

/** Deposit, coupon and early-bird discounts of a preorder product. */
export function PreorderProductPayment({
  form,
}: {
  form: UseFormReturn<ProductFormValues>
}) {
  const { t } = useTranslation('preorder')
  const types = TYPES.map((v) => ({ value: v, label: t(`form.type.${v}`) }))
  const type = (
    name:
      | 'prepayment.type'
      | 'coupon.type'
      | 'advance.after_type'
      | 'advance.direct_type',
    label: string
  ) => <FormSelectField form={form} name={name} label={label} options={types} />

  return (
    <PreorderFormSection
      title={t('form.payment')}
      description={t('form.paymentHint')}
    >
      <PreorderToggleBlock
        form={form}
        name='prepayment.enabled'
        label={t('form.prepayment')}
        hint={t('form.prepaymentHint')}
      >
        {type('prepayment.type', t('form.amountType'))}
        <FormInputField
          form={form}
          name='prepayment.amount'
          type='number'
          label={t('form.amount')}
        />
      </PreorderToggleBlock>
      <PreorderToggleBlock
        form={form}
        name='coupon.enabled'
        label={t('form.coupon')}
        hint={t('form.couponHint')}
      >
        <FormInputField
          form={form}
          name='coupon.code'
          label={t('form.couponCode')}
        />
        {type('coupon.type', t('form.amountType'))}
        <FormInputField
          form={form}
          name='coupon.amount'
          type='number'
          label={t('form.amount')}
        />
        <FormTextareaField
          form={form}
          name='coupon.instructions'
          label={t('form.couponInstructions')}
          rows={2}
          className='md:col-span-2'
        />
      </PreorderToggleBlock>
      <PreorderToggleBlock
        form={form}
        name='advance.enabled'
        label={t('form.advance')}
        hint={t('form.advanceHint')}
      >
        {type('advance.after_type', t('form.afterType'))}
        <FormInputField
          form={form}
          name='advance.after_amount'
          type='number'
          label={t('form.afterAmount')}
        />
        {type('advance.direct_type', t('form.directType'))}
        <FormInputField
          form={form}
          name='advance.direct_amount'
          type='number'
          label={t('form.directAmount')}
        />
      </PreorderToggleBlock>
    </PreorderFormSection>
  )
}
