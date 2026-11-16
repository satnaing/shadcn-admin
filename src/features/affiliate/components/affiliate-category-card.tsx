import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { FormInputField } from '@/components/forms/form-input-field'
import { FormSelectField } from '@/components/forms/form-select-field'
import { FormSwitchField } from '@/components/forms/form-switch-field'
import {
  type CategoryWiseFormValues,
  categoryWiseSchema,
} from '../data/affiliate.schema'
import { useAffiliateMutations } from '../hooks/use-affiliate-mutations'
import { useCommissionTypes } from '../hooks/use-commission-types'
import { AffiliateOptionCard } from './affiliate-option-card'

/** A commission per category (AEC listed every category at once); excludes the product-sharing option. */
export function AffiliateCategoryCard({
  defaults,
}: {
  defaults: CategoryWiseFormValues
}) {
  const { t } = useTranslation('affiliate')
  const types = useCommissionTypes()
  const { saveOption } = useAffiliateMutations()
  const form = useForm<CategoryWiseFormValues>({
    resolver: zodResolver(categoryWiseSchema),
    defaultValues: defaults,
  })

  return (
    <AffiliateOptionCard
      form={form}
      title={t('category.title')}
      description={t('category.description')}
      pending={saveOption.isPending}
      onSubmit={(values) =>
        saveOption.mutate({ type: 'category_wise_affiliate', values })
      }
    >
      <FormSwitchField
        form={form}
        name='status'
        label={t('option.status')}
        hint={t('option.exclusive')}
      />
      {defaults.items.length === 0 && (
        <p className='text-sm text-muted-foreground'>{t('category.empty')}</p>
      )}
      <div className='max-h-96 space-y-3 overflow-y-auto pe-2'>
        {defaults.items.map((item, i) => (
          <div
            key={item.category_id}
            className='grid items-start gap-3 sm:grid-cols-[1fr_9rem_10rem]'
          >
            <div className='pt-8 text-sm font-medium'>{item.category_name}</div>
            <FormInputField
              form={form}
              name={`items.${i}.commission`}
              type='number'
              label={t('category.commission')}
            />
            <FormSelectField
              form={form}
              name={`items.${i}.commission_type`}
              label={t('category.type')}
              options={types}
            />
          </div>
        ))}
      </div>
    </AffiliateOptionCard>
  )
}
