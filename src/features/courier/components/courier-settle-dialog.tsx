import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCurrencyFormatter } from '@/shared/hooks/useCurrencyFormatter'
import { useTranslation } from 'react-i18next'
import { EntityFormDialog } from '@/components/forms/entity-form-dialog'
import { FormInputField } from '@/components/forms/form-input-field'
import { type SettleFormValues, settleSchema } from '../data/courier.schema'
import type { CourierItem } from '../data/courier.type'
import { useCourierMutations } from '../hooks/use-courier-mutations'

export type SettleKind = 'collect' | 'pay'

interface Props {
  /** Courier to settle with; `null` keeps the dialog closed. */
  courier: CourierItem | null
  kind: SettleKind
  onClose: () => void
}

function SettleForm({
  courier,
  kind,
  onClose,
}: {
  courier: CourierItem
  kind: SettleKind
  onClose: () => void
}) {
  const { t } = useTranslation('courier')
  const { formatMoney } = useCurrencyFormatter()
  const { collect, pay } = useCourierMutations()
  const mutation = kind === 'collect' ? collect : pay
  // collect = cash the courier holds, pay = what the store owes the courier
  const max =
    kind === 'collect' ? courier.total_collection : courier.total_earning
  const schema = useMemo(() => settleSchema(max), [max])
  const form = useForm<SettleFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { amount: max },
  })
  const label = t(
    kind === 'collect' ? 'settle.collectAction' : 'settle.payAction'
  )

  return (
    <EntityFormDialog
      open
      onOpenChange={(open) => !open && onClose()}
      form={form}
      title={t(kind === 'collect' ? 'settle.collectTitle' : 'settle.payTitle')}
      description={t('settle.description', { name: courier.name })}
      isCreate
      isPending={mutation.isPending}
      labels={{
        saving: t('actions.saving'),
        saveAndExit: label,
        updating: t('actions.saving'),
        updateAndExit: label,
      }}
      onSubmit={form.handleSubmit((v) =>
        mutation.mutate(
          { id: courier.id, amount: v.amount },
          { onSuccess: onClose }
        )
      )}
      contentClassName='sm:max-w-md'
    >
      <p className='text-sm text-muted-foreground'>
        {t(kind === 'collect' ? 'settle.holding' : 'settle.payable')}:{' '}
        <span className='font-medium text-foreground'>{formatMoney(max)}</span>
      </p>
      {max <= 0 ? (
        <p className='text-sm text-muted-foreground'>{t('settle.nothing')}</p>
      ) : (
        <FormInputField
          form={form}
          name='amount'
          type='number'
          label={t(kind === 'collect' ? 'settle.collected' : 'settle.paid')}
        />
      )}
    </EntityFormDialog>
  )
}

/** Cash collection from a courier / payout to a courier: the amount cannot exceed what is held / owed. */
export function CourierSettleDialog({ courier, kind, onClose }: Props) {
  return courier ? (
    <SettleForm
      key={`${courier.id}-${kind}`}
      courier={courier}
      kind={kind}
      onClose={onClose}
    />
  ) : null
}
