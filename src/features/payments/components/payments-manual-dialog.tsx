import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { EntityFormDialog } from '@/components/forms/entity-form-dialog'
import { FormImageField } from '@/components/forms/form-image-field'
import { FormInputField } from '@/components/forms/form-input-field'
import { FormSelectField } from '@/components/forms/form-select-field'
import { FormTextareaField } from '@/components/forms/form-textarea-field'
import { type ManualFormValues, manualDefaults, manualSchema } from '../data/payments.schema'
import { MANUAL_TYPES, type ManualMethod } from '../data/payments.type'
import { usePaymentsMutations } from '../hooks/use-payments-mutations'
import { PaymentsBankRows } from './payments-bank-rows'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Method being edited; `null` = create. Remount with `key`. */
  method: ManualMethod | null
}

/** AEC had a create page and an edit page; one dialog serves both. */
export function PaymentsManualDialog({ open, onOpenChange, method }: Props) {
  const { t } = useTranslation('payments')
  const { saveManual } = usePaymentsMutations()
  const form = useForm<ManualFormValues>({
    resolver: zodResolver(manualSchema),
    defaultValues: method
      ? { type: method.type, heading: method.heading, description: method.description, photo: method.photo ?? '', bank_info: method.bank_info }
      : manualDefaults,
  })
  const isBank = useWatch({ control: form.control, name: 'type' }) === 'bank_payment'
  const submit = form.handleSubmit((v) =>
    saveManual.mutate(
      {
        id: method?.id,
        values: { ...v, photo: v.photo || null, bank_info: v.type === 'bank_payment' ? v.bank_info : [] },
      },
      { onSuccess: () => onOpenChange(false) }
    )
  )

  return (
    <EntityFormDialog
      open={open}
      onOpenChange={onOpenChange}
      form={form}
      title={t(method ? 'manual.form.editTitle' : 'manual.form.createTitle')}
      description={t('manual.form.description')}
      isCreate={!method}
      isPending={saveManual.isPending}
      labels={{ saving: t('actions.saving'), saveAndExit: t('actions.save'), updating: t('actions.saving'), updateAndExit: t('actions.save') }}
      onSubmit={submit}
    >
      <FormSelectField
        form={form}
        name='type'
        label={t('manual.form.type')}
        options={MANUAL_TYPES.map((v) => ({ value: v, label: t(`manual.types.${v}`) }))}
      />
      <FormInputField form={form} name='heading' label={t('manual.form.heading')} />
      <FormImageField form={form} name='photo' label={t('manual.form.photo')} />
      <FormTextareaField form={form} name='description' rows={4} label={t('manual.form.descriptionField')} />
      {isBank && <PaymentsBankRows form={form} />}
    </EntityFormDialog>
  )
}
