import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { EntityFormDialog } from '@/components/forms/entity-form-dialog'
import { FormImageField } from '@/components/forms/form-image-field'
import { FormInputField } from '@/components/forms/form-input-field'
import { FormSelectField } from '@/components/forms/form-select-field'
import { type PayoutFormValues, payoutDefaults, payoutSchema } from '../data/payments.schema'
import { PAYOUT_TYPES, type PayoutMethod } from '../data/payments.type'
import { usePaymentsMutations } from '../hooks/use-payments-mutations'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Method being edited; `null` = create. Remount with `key`. */
  method: PayoutMethod | null
}

/** A way customers can choose to receive a refund (AEC "Offline Payout Method Information"). */
export function PaymentsPayoutDialog({ open, onOpenChange, method }: Props) {
  const { t } = useTranslation('payments')
  const { savePayout } = usePaymentsMutations()
  const form = useForm<PayoutFormValues>({
    resolver: zodResolver(payoutSchema),
    defaultValues: method ? { type: method.type, name: method.name, logo: method.logo ?? '' } : payoutDefaults,
  })
  const submit = form.handleSubmit((values) =>
    savePayout.mutate({ id: method?.id, values }, { onSuccess: () => onOpenChange(false) })
  )

  return (
    <EntityFormDialog
      open={open}
      onOpenChange={onOpenChange}
      form={form}
      title={t(method ? 'payouts.form.editTitle' : 'payouts.form.createTitle')}
      description={t('payouts.form.description')}
      isCreate={!method}
      isPending={savePayout.isPending}
      labels={{ saving: t('actions.saving'), saveAndExit: t('actions.save'), updating: t('actions.saving'), updateAndExit: t('actions.save') }}
      onSubmit={submit}
      contentClassName='sm:max-w-lg'
    >
      <FormSelectField
        form={form}
        name='type'
        label={t('payouts.form.type')}
        options={PAYOUT_TYPES.map((v) => ({ value: v, label: t(`payouts.types.${v}`) }))}
      />
      <FormInputField form={form} name='name' label={t('payouts.form.name')} />
      <FormImageField form={form} name='logo' label={t('payouts.form.logo')} />
    </EntityFormDialog>
  )
}
