import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCurrencyFormatter } from '@/shared/hooks/useCurrencyFormatter'
import { useTranslation } from 'react-i18next'
import { EntityFormDialog } from '@/components/forms/entity-form-dialog'
import { FormInputField } from '@/components/forms/form-input-field'
import { FormSelectField } from '@/components/forms/form-select-field'
import { type PayoutFormValues, payoutSchema } from '../data/affiliate.schema'
import { type AffiliateUserDetail, PAY_METHODS } from '../data/affiliate.type'
import { useAffiliateUser } from '../hooks/use-affiliate'
import { useAffiliateMutations } from '../hooks/use-affiliate-mutations'

interface Props {
  /** Affiliate user to pay; `null` keeps the dialog closed. */
  userId: number | null
  /** Set when paying a withdraw request: its amount is fixed and the request is marked approved. */
  withdraw?: { id: number; amount: number } | null
  onClose: () => void
}

function PayForm({
  user,
  withdraw,
  onClose,
}: {
  user: AffiliateUserDetail
  withdraw?: Props['withdraw']
  onClose: () => void
}) {
  const { t } = useTranslation('affiliate')
  const { formatMoney } = useCurrencyFormatter()
  const { payUser, payWithdraw } = useAffiliateMutations()
  const max = withdraw ? withdraw.amount : user.balance
  const schema = useMemo(() => payoutSchema(max), [max])
  const form = useForm<PayoutFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { amount: max, payment_method: undefined },
  })
  const pending = payUser.isPending || payWithdraw.isPending
  const submit = form.handleSubmit((v) =>
    withdraw
      ? payWithdraw.mutate(
          { id: withdraw.id, method: v.payment_method },
          { onSuccess: onClose }
        )
      : payUser.mutate({ id: user.id, payload: v }, { onSuccess: onClose })
  )
  const info = [
    [t('pay.dueAmount'), formatMoney(user.balance)],
    [t('pay.paypalEmail'), user.paypal_email || '—'],
    [t('pay.bankInfo'), user.bank_information || '—'],
    ...(withdraw ? [[t('pay.amount'), formatMoney(withdraw.amount)]] : []),
  ]

  return (
    <EntityFormDialog
      open
      onOpenChange={(open) => !open && onClose()}
      form={form}
      title={t(withdraw ? 'pay.withdrawTitle' : 'pay.title')}
      description={t('pay.description', { name: user.name })}
      isCreate
      isPending={pending}
      labels={{
        saving: t('actions.saving'),
        saveAndExit: t('actions.pay'),
        updating: t('actions.saving'),
        updateAndExit: t('actions.pay'),
      }}
      onSubmit={submit}
      contentClassName='sm:max-w-md'
    >
      <dl className='grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm'>
        {info.map(([label, value]) => (
          <div key={label} className='contents'>
            <dt className='text-muted-foreground'>{label}</dt>
            <dd className='font-medium break-words'>{value}</dd>
          </div>
        ))}
      </dl>
      {max <= 0 ? (
        <p className='text-sm text-muted-foreground'>{t('pay.noBalance')}</p>
      ) : (
        <>
          {!withdraw && (
            <FormInputField
              form={form}
              name='amount'
              type='number'
              label={t('pay.amount')}
            />
          )}
          <FormSelectField
            form={form}
            name='payment_method'
            label={t('pay.method')}
            placeholder={t('pay.selectMethod')}
            options={PAY_METHODS.map((m) => ({
              value: m,
              label: t(`pay.methods.${m}`),
            }))}
          />
        </>
      )}
    </EntityFormDialog>
  )
}

/** Manual payout to an affiliate: shows what they asked to be paid to, then records amount + method. */
export function AffiliatePayDialog({ userId, withdraw, onClose }: Props) {
  const { data } = useAffiliateUser(userId ?? undefined)

  return userId && data ? (
    <PayForm
      key={`${userId}-${withdraw?.id}`}
      user={data.data}
      withdraw={withdraw}
      onClose={onClose}
    />
  ) : null
}
