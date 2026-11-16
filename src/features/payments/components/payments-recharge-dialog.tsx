import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { EntityFormDialog } from '@/components/forms/entity-form-dialog'
import { FormImageField } from '@/components/forms/form-image-field'
import { FormInputField } from '@/components/forms/form-input-field'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { type RechargeFormValues, rechargeDefaults, rechargeSchema } from '../data/payments.schema'
import { usePaymentsMutations } from '../hooks/use-payments-mutations'
import { PaymentsCustomerPicker } from './payments-customer-picker'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
}

/** Admin tops up a customer wallet after receiving an offline payment (AEC "Offline Wallet Recharge" offcanvas). */
export function PaymentsRechargeDialog({ open, onOpenChange }: Props) {
  const { t } = useTranslation('payments')
  const { recharge } = usePaymentsMutations()
  const form = useForm<RechargeFormValues>({ resolver: zodResolver(rechargeSchema), defaultValues: rechargeDefaults })
  const submit = form.handleSubmit((v) => recharge.mutate(v, { onSuccess: () => onOpenChange(false) }))

  return (
    <EntityFormDialog
      open={open}
      onOpenChange={onOpenChange}
      form={form}
      title={t('recharge.title')}
      description={t('recharge.description')}
      isCreate
      isPending={recharge.isPending}
      labels={{ saving: t('actions.saving'), saveAndExit: t('recharge.confirm'), updating: t('actions.saving'), updateAndExit: t('recharge.confirm') }}
      onSubmit={submit}
      contentClassName='sm:max-w-lg'
    >
      <FormField
        control={form.control}
        name='user_id'
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('recharge.customer')}</FormLabel>
            <FormControl>
              <PaymentsCustomerPicker value={field.value} onChange={field.onChange} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormInputField form={form} name='amount' type='number' label={t('recharge.amount')} />
      <FormInputField form={form} name='trx_id' label={t('recharge.trxId')} />
      <FormImageField form={form} name='photo' label={t('recharge.photo')} />
    </EntityFormDialog>
  )
}
