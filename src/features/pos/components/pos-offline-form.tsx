import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { FormImageField } from '@/components/forms/form-image-field'
import { FormInputField } from '@/components/forms/form-input-field'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { useCurrencyFormatter } from '@/shared/hooks/useCurrencyFormatter'
import { type OfflineFormValues, offlineSchema } from '../data/pos.schema'
import type { PosOfflinePayment } from '../data/pos.type'

interface Props {
  /** The amount is always the order total; the cashier cannot change it (AEC readonly input). */
  total: number
  pending: boolean
  onBack: () => void
  onConfirm: (payment: PosOfflinePayment) => void
}

/** Offline payment info: method name, transaction id and an optional proof image. */
export function PosOfflineForm({ total, pending, onBack, onConfirm }: Props) {
  const { t } = useTranslation('pos')
  const { formatMoney } = useCurrencyFormatter()
  const form = useForm<OfflineFormValues>({
    resolver: zodResolver(offlineSchema),
    defaultValues: { method: '', trx_id: '', proof: null },
  })

  return (
    <Form {...form}>
      <form
        className='space-y-4'
        onSubmit={form.handleSubmit((v) =>
          onConfirm({ method: v.method, amount: total, trx_id: v.trx_id, proof: v.proof })
        )}
      >
        <FormInputField form={form} name='method' label={t('offline.method')} />
        <p className='text-sm'>
          {t('offline.amount')}: <span className='font-semibold'>{formatMoney(total)}</span>
        </p>
        <FormInputField form={form} name='trx_id' label={t('offline.trxId')} />
        <FormImageField form={form} name='proof' label={t('offline.proof')} />
        <div className='flex justify-end gap-2'>
          <Button type='button' variant='outline' onClick={onBack}>
            {t('actions.back')}
          </Button>
          <Button type='submit' disabled={pending}>
            {t('offline.confirm')}
          </Button>
        </div>
      </form>
    </Form>
  )
}
