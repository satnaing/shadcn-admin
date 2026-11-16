import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { FormInputField } from '@/components/forms/form-input-field'
import { FormSelectField } from '@/components/forms/form-select-field'
import { FormSwitchField } from '@/components/forms/form-switch-field'
import {
  type ProductSharingFormValues,
  productSharingSchema,
} from '../data/affiliate.schema'
import { useAffiliateMutations } from '../hooks/use-affiliate-mutations'
import { useCommissionTypes } from '../hooks/use-commission-types'
import { AffiliateOptionCard } from './affiliate-option-card'

/** One commission for every shared product; excludes the category-wise option. */
export function AffiliateProductSharingCard({
  defaults,
}: {
  defaults: ProductSharingFormValues
}) {
  const { t } = useTranslation('affiliate')
  const types = useCommissionTypes()
  const { saveOption } = useAffiliateMutations()
  const form = useForm<ProductSharingFormValues>({
    resolver: zodResolver(productSharingSchema),
    defaultValues: defaults,
  })

  return (
    <AffiliateOptionCard
      form={form}
      title={t('product.title')}
      description={t('product.description')}
      pending={saveOption.isPending}
      onSubmit={(values) =>
        saveOption.mutate({ type: 'product_sharing', values })
      }
    >
      <div className='grid gap-4 sm:grid-cols-2'>
        <FormInputField
          form={form}
          name='commission'
          type='number'
          label={t('product.commission')}
        />
        <FormSelectField
          form={form}
          name='commission_type'
          label={t('product.type')}
          options={types}
        />
      </div>
      <FormSwitchField
        form={form}
        name='status'
        label={t('option.status')}
        hint={t('option.exclusive')}
      />
    </AffiliateOptionCard>
  )
}
