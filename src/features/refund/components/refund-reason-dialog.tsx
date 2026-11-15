import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { EntityFormDialog } from '@/components/forms/entity-form-dialog'
import { FormInputField } from '@/components/forms/form-input-field'
import { FormSelectField } from '@/components/forms/form-select-field'
import { type ReasonFormValues, reasonDefaults, reasonSchema, reasonToForm } from '../data/refund.schema'
import { LOCALES, REASON_KINDS, type ReasonItem } from '../data/refund.type'
import { useRefundMutations } from '../hooks/use-refund-mutations'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Reason being edited; `undefined` = create. Remount with `key`. */
  reason?: ReasonItem
}

export function RefundReasonDialog({ open, onOpenChange, reason }: Props) {
  const { t } = useTranslation('refund')
  const { createReason, updateReason } = useRefundMutations()
  const form = useForm<ReasonFormValues>({
    resolver: zodResolver(reasonSchema),
    defaultValues: reason ? reasonToForm(reason) : reasonDefaults,
  })
  const mutation = reason ? updateReason : createReason
  const submit = form.handleSubmit((values) => {
    const onSuccess = () => onOpenChange(false)
    if (reason) updateReason.mutate({ id: reason.id, values }, { onSuccess })
    else createReason.mutate(values, { onSuccess })
  })

  return (
    <EntityFormDialog
      open={open}
      onOpenChange={onOpenChange}
      form={form}
      title={t(reason ? 'reasons.form.editTitle' : 'reasons.form.createTitle')}
      description={t('reasons.form.description')}
      isCreate={!reason}
      isPending={mutation.isPending}
      labels={{ saving: t('actions.saving'), saveAndExit: t('actions.save'), updating: t('actions.saving'), updateAndExit: t('actions.save') }}
      onSubmit={submit}
      contentClassName='sm:max-w-lg'
    >
      <FormSelectField
        form={form}
        name='kind'
        label={t('reasons.form.kind')}
        options={REASON_KINDS.map((k) => ({ value: k, label: t(`kind.${k}`) }))}
      />
      {LOCALES.map((l) => (
        <FormInputField key={l} form={form} name={`translations.${l}`} label={t(`reasons.form.text`, { lang: l.toUpperCase() })} />
      ))}
    </EntityFormDialog>
  )
}
