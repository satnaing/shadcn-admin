import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { FormInputField } from '@/components/forms/form-input-field'
import {
  type SettingsFormValues,
  settingsSchema,
} from '../data/affiliate.schema'
import { useAffiliateMutations } from '../hooks/use-affiliate-mutations'
import { AffiliateOptionCard } from './affiliate-option-card'

/** The two numbers of the addon configuration: smallest withdraw request and how long a referral link stays valid. */
export function AffiliateSettingsCard({
  defaults,
}: {
  defaults: SettingsFormValues
}) {
  const { t } = useTranslation('affiliate')
  const { saveSettings } = useAffiliateMutations()
  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: defaults,
  })

  return (
    <AffiliateOptionCard
      form={form}
      title={t('settings.title')}
      description={t('settings.description')}
      pending={saveSettings.isPending}
      onSubmit={(v) => saveSettings.mutate(v)}
    >
      <div className='grid gap-4 sm:grid-cols-2'>
        <FormInputField
          form={form}
          name='minimum_withdraw_amount'
          type='number'
          label={t('settings.minWithdraw')}
          hint={t('settings.minWithdrawHint')}
        />
        <FormInputField
          form={form}
          name='validation_days'
          type='number'
          label={t('settings.validationDays')}
          hint={t('settings.validationDaysHint')}
        />
      </div>
    </AffiliateOptionCard>
  )
}
