import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { EntityFormDialog } from '@/components/forms/entity-form-dialog'
import { FormInputField } from '@/components/forms/form-input-field'
import { ImagePicker } from '@/components/image-picker'
import { FormField, FormItem } from '@/components/ui/form'
import { useCurrencyFormatter } from '@/shared/hooks/useCurrencyFormatter'
import { type OfflinePayFormValues, offlinePaySchema } from '../data/refund.schema'
import type { RefundDetail, RefundKind } from '../data/refund.type'
import { useRefundMutations } from '../hooks/use-refund-mutations'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  refund: RefundDetail
  kind: RefundKind
  onDone: () => void
}

/** Wallet refunds are one confirmation; offline refunds need the bank transaction id and (optionally) the receipt. */
export function RefundPayDialog({ open, onOpenChange, refund, kind, onDone }: Props) {
  const { t } = useTranslation('refund')
  const { formatMoney } = useCurrencyFormatter()
  const { pay, payDispute } = useRefundMutations()
  const mutation = kind === 'dispute' ? payDispute : pay
  const form = useForm<OfflinePayFormValues>({
    resolver: zodResolver(offlinePaySchema),
    defaultValues: { transaction_id: '', receipt: '' },
  })
  const finish = () => {
    onOpenChange(false)
    onDone()
  }

  if (refund.payment_channel === 'wallet') {
    return (
      <ConfirmDialog
        open={open}
        onOpenChange={onOpenChange}
        title={t('pay.walletTitle')}
        desc={t('pay.walletDesc', { amount: formatMoney(refund.amount), name: refund.customer_name })}
        confirmText={t('actions.refundNow')}
        isLoading={mutation.isPending}
        handleConfirm={() => mutation.mutate({ id: refund.id, payload: { method: 'wallet' } }, { onSuccess: finish })}
      />
    )
  }

  return (
    <EntityFormDialog
      open={open}
      onOpenChange={onOpenChange}
      form={form}
      title={t('pay.offlineTitle')}
      description={t('pay.offlineDesc', { amount: formatMoney(refund.amount) })}
      isCreate
      isPending={mutation.isPending}
      labels={{ saving: t('actions.saving'), saveAndExit: t('actions.confirm'), updating: t('actions.saving'), updateAndExit: t('actions.confirm') }}
      onSubmit={form.handleSubmit((v) =>
        mutation.mutate({ id: refund.id, payload: { method: 'offline', ...v } }, { onSuccess: finish })
      )}
      contentClassName='sm:max-w-md'
    >
      <FormInputField form={form} name='transaction_id' label={t('pay.transactionId')} />
      <FormField
        control={form.control}
        name='receipt'
        render={({ field }) => (
          <FormItem>
            <ImagePicker label={t('pay.receipt')} value={field.value} onChange={field.onChange} />
          </FormItem>
        )}
      />
    </EntityFormDialog>
  )
}
