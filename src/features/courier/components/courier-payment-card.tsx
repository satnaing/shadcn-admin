import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { PERMISSIONS } from '@/shared/permissions'
import { useTranslation } from 'react-i18next'
import { FormInputField } from '@/components/forms/form-input-field'
import { FormSelectField } from '@/components/forms/form-select-field'
import { type PaymentFormValues, paymentSchema } from '../data/courier.schema'
import type { CourierSettings } from '../data/courier.type'
import { useCourierMutations } from '../hooks/use-courier-mutations'
import { CourierFormCard } from './courier-form-card'

/** How couriers are paid: a monthly salary or a fixed commission per delivered order. */
export function CourierPaymentCard({
  settings,
}: {
  settings: CourierSettings
}) {
  const { t } = useTranslation('courier')
  const { saveSettings } = useCourierMutations()
  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      payment_type: settings.payment_type,
      salary: settings.salary,
      commission: settings.commission,
    },
  })
  const type = useWatch({ control: form.control, name: 'payment_type' })

  return (
    <CourierFormCard
      form={form}
      title={t('config.paymentTitle')}
      description={t('config.paymentDescription')}
      permission={PERMISSIONS.COURIER.CONFIG_MANAGE}
      pending={saveSettings.isPending}
      onSubmit={(v) => saveSettings.mutate(v)}
    >
      <FormSelectField
        form={form}
        name='payment_type'
        label={t('config.paymentType')}
        options={[
          { value: 'salary', label: t('config.salaryOption') },
          { value: 'commission', label: t('config.commissionOption') },
        ]}
      />
      {type === 'salary' ? (
        <FormInputField
          form={form}
          name='salary'
          type='number'
          label={t('config.salary')}
        />
      ) : (
        <FormInputField
          form={form}
          name='commission'
          type='number'
          label={t('config.commission')}
          hint={t('config.commissionHint')}
        />
      )}
    </CourierFormCard>
  )
}
