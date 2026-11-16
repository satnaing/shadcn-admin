import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { EntityFormDialog } from '@/components/forms/entity-form-dialog'
import { FormInputField } from '@/components/forms/form-input-field'
import { FormTextareaField } from '@/components/forms/form-textarea-field'
import { type StepFormValues, stepSchema } from '../data/preorder.schema'
import type { OrderStep } from '../data/preorder.type'
import { usePreorderMutations } from '../hooks/use-preorder-mutations'

interface Props {
  orderId: number
  step: OrderStep | null
  status: 'accepted' | 'denied'
  onClose: () => void
}

/** Accept / deny one workflow step with an optional note (shipping also takes a proof link). */
export function PreorderStepDialog({ orderId, step, status, onClose }: Props) {
  const { t } = useTranslation('preorder')
  const { setStep } = usePreorderMutations()
  const form = useForm<StepFormValues>({
    resolver: zodResolver(stepSchema),
    defaultValues: { note: '', proof: '' },
  })
  const submit = form.handleSubmit((values) => {
    if (step)
      setStep.mutate(
        { id: orderId, step, payload: { status, ...values } },
        { onSuccess: onClose }
      )
  })

  return (
    <EntityFormDialog
      open={step !== null}
      onOpenChange={(open) => !open && onClose()}
      form={form}
      title={t(`stepDialog.${status}`, { step: step ? t(`step.${step}`) : '' })}
      description={t('stepDialog.description')}
      isCreate={false}
      isPending={setStep.isPending}
      labels={{
        saving: t('actions.saving'),
        saveAndExit: t('actions.save'),
        updating: t('actions.saving'),
        updateAndExit: t('actions.confirm'),
      }}
      onSubmit={submit}
    >
      <FormTextareaField
        form={form}
        name='note'
        label={t('stepDialog.note')}
        rows={3}
      />
      {step === 'shipping' && (
        <FormInputField
          form={form}
          name='proof'
          label={t('stepDialog.proof')}
          hint={t('stepDialog.proofHint')}
        />
      )}
    </EntityFormDialog>
  )
}
