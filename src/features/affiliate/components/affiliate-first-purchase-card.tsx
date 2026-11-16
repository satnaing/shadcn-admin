import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { FormInputField } from '@/components/forms/form-input-field'
import { FormSwitchField } from '@/components/forms/form-switch-field'
import {
  type FirstPurchaseFormValues,
  firstPurchaseSchema,
} from '../data/affiliate.schema'
import { useAffiliateMutations } from '../hooks/use-affiliate-mutations'
import { AffiliateOptionCard } from './affiliate-option-card'

/** Commission (% of the order total) when a referred customer places their first order. */
export function AffiliateFirstPurchaseCard({
  defaults,
}: {
  defaults: FirstPurchaseFormValues
}) {
  const { t } = useTranslation('affiliate')
  const { saveOption } = useAffiliateMutations()
  const form = useForm<FirstPurchaseFormValues>({
    resolver: zodResolver(firstPurchaseSchema),
    defaultValues: defaults,
  })

  return (
    <AffiliateOptionCard
      form={form}
      title={t('first.title')}
      description={t('first.description')}
      pending={saveOption.isPending}
      onSubmit={(values) =>
        saveOption.mutate({ type: 'user_registration_first_purchase', values })
      }
    >
      <FormInputField
        form={form}
        name='percentage'
        type='number'
        label={t('first.percentage')}
        hint={t('first.percentageHint')}
      />
      <FormSwitchField form={form} name='status' label={t('option.status')} />
    </AffiliateOptionCard>
  )
}
