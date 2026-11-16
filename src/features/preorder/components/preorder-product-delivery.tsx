import type { UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { FormInputField } from '@/components/forms/form-input-field'
import { FormSelectField } from '@/components/forms/form-select-field'
import { FormSwitchField } from '@/components/forms/form-switch-field'
import type { ProductFormValues } from '../data/preorder.schema'
import { usePreorderLookups } from '../hooks/use-preorder'
import { PreorderFormSection } from './preorder-form-section'
import { PreorderToggleBlock } from './preorder-toggle-block'

/** Refund, shipping, cash on delivery and stock rules. */
export function PreorderProductDelivery({
  form,
}: {
  form: UseFormReturn<ProductFormValues>
}) {
  const { t } = useTranslation('preorder')
  const { data } = usePreorderLookups()
  const notes = (data?.data.notes ?? []).map((n) => ({
    value: String(n.id),
    label: n.name,
  }))
  const note = (
    name: 'refund.note_id' | 'shipping.note_id' | 'cod.note_id'
  ) => (
    <FormSelectField
      form={form}
      name={name}
      numeric
      label={t('form.note')}
      options={notes}
    />
  )

  return (
    <PreorderFormSection title={t('form.delivery')}>
      <PreorderToggleBlock
        form={form}
        name='refund.enabled'
        label={t('form.refundable')}
      >
        <FormSwitchField
          form={form}
          name='refund.show_note'
          label={t('form.showNote')}
        />
        {note('refund.note_id')}
      </PreorderToggleBlock>
      <div className='grid gap-4 md:grid-cols-2'>
        <FormSelectField
          form={form}
          name='shipping.type'
          label={t('form.shippingType')}
          options={[
            { value: 'free', label: t('form.shipping.free') },
            { value: 'flat', label: t('form.shipping.flat') },
          ]}
        />
        <span />
        <FormInputField
          form={form}
          name='shipping.min_days'
          type='number'
          label={t('form.minDays')}
        />
        <FormInputField
          form={form}
          name='shipping.max_days'
          type='number'
          label={t('form.maxDays')}
        />
        <FormSwitchField
          form={form}
          name='shipping.show_time'
          label={t('form.showTime')}
        />
        <FormSwitchField
          form={form}
          name='shipping.show_note'
          label={t('form.showNote')}
        />
        {note('shipping.note_id')}
      </div>
      <PreorderToggleBlock form={form} name='cod.enabled' label={t('form.cod')}>
        <FormSwitchField
          form={form}
          name='cod.prepayment_needed'
          label={t('form.codPrepayment')}
        />
        <FormSwitchField
          form={form}
          name='cod.show_note'
          label={t('form.showNote')}
        />
        {note('cod.note_id')}
      </PreorderToggleBlock>
      <PreorderToggleBlock
        form={form}
        name='stock.enabled'
        label={t('form.stock')}
        hint={t('form.stockHint')}
      >
        <FormSelectField
          form={form}
          name='stock.visibility'
          label={t('form.stockVisibility')}
          options={['quantity', 'text', 'hidden'].map((v) => ({
            value: v,
            label: t(`form.visibility.${v}`),
          }))}
        />
        <FormInputField
          form={form}
          name='stock.current'
          type='number'
          label={t('form.stockCurrent')}
        />
        <FormInputField
          form={form}
          name='stock.low'
          type='number'
          label={t('form.stockLow')}
        />
        <FormSwitchField
          form={form}
          name='stock.low_warning'
          label={t('form.stockWarning')}
        />
        <FormInputField
          form={form}
          name='stock.preorder_quantity'
          type='number'
          label={t('form.preorderQty')}
        />
        <FormInputField
          form={form}
          name='stock.final_quantity'
          type='number'
          label={t('form.finalQty')}
        />
        <FormSwitchField
          form={form}
          name='stock.custom_order_show'
          label={t('form.customOrderShow')}
        />
      </PreorderToggleBlock>
    </PreorderFormSection>
  )
}
