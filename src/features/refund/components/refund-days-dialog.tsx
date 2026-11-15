import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { EntityFormDialog } from '@/components/forms/entity-form-dialog'
import { FormInputField } from '@/components/forms/form-input-field'
import { type DaysFormValues, daysSchema } from '../data/refund.schema'
import { useRefundMutations } from '../hooks/use-refund-mutations'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  ids: number[]
  /** Current value when editing one category. Remount with `key`. */
  current?: number
  onDone?: () => void
}

/** Sets the refund period (days) of one category or of a selection; the API applies it to all sub-categories. */
export function RefundDaysDialog({ open, onOpenChange, ids, current = 0, onDone }: Props) {
  const { t } = useTranslation('refund')
  const { setCategoryDays, bulkCategoryDays } = useRefundMutations()
  const form = useForm<DaysFormValues>({ resolver: zodResolver(daysSchema), defaultValues: { refund_days: current } })
  const mutation = ids.length === 1 ? setCategoryDays : bulkCategoryDays
  const submit = form.handleSubmit(({ refund_days }) => {
    const onSuccess = () => {
      onOpenChange(false)
      onDone?.()
    }
    if (ids.length === 1) setCategoryDays.mutate({ id: ids[0], days: refund_days }, { onSuccess })
    else bulkCategoryDays.mutate({ ids, days: refund_days }, { onSuccess })
  })

  return (
    <EntityFormDialog
      open={open}
      onOpenChange={onOpenChange}
      form={form}
      title={t(ids.length === 1 ? 'categories.daysTitle' : 'categories.bulkTitle')}
      description={t(ids.length === 1 ? 'categories.daysDesc' : 'categories.bulkDesc', { count: ids.length })}
      isCreate={false}
      isPending={mutation.isPending}
      labels={{ saving: t('actions.saving'), saveAndExit: t('actions.save'), updating: t('actions.saving'), updateAndExit: t('actions.save') }}
      onSubmit={submit}
      contentClassName='sm:max-w-sm'
    >
      <FormInputField form={form} name='refund_days' type='number' label={t('categories.columns.days')} hint={t('categories.zeroHint')} />
    </EntityFormDialog>
  )
}
