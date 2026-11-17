import type { UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { FormInputField } from '@/components/forms/form-input-field'
import { FormSelectField } from '@/components/forms/form-select-field'
import { FormSwitchField } from '@/components/forms/form-switch-field'
import type { PackageFormValues } from '../data/seller-package.schema'
import {
  EXTRA_LIMITS,
  FEATURE_FLAGS,
  SUPPORT_PRIORITIES,
} from '../data/seller-package.type'

/** The multi-dimension limits of the target model (D22); AEC only has the upload counts. */
export function SellerPackageLimitsFields({
  form,
}: {
  form: UseFormReturn<PackageFormValues>
}) {
  const { t } = useTranslation('seller_package')

  return (
    <fieldset className='space-y-4'>
      <legend className='text-sm font-semibold'>{t('form.limitsTitle')}</legend>
      <p className='text-sm text-muted-foreground'>{t('form.limitsHint')}</p>
      <div className='grid gap-4 sm:grid-cols-2'>
        {EXTRA_LIMITS.map((key) => (
          <FormInputField
            key={key}
            form={form}
            name={key}
            type='number'
            label={t(`limits.${key}`)}
          />
        ))}
        <FormSelectField
          form={form}
          name='support_priority'
          label={t('limits.support_priority')}
          options={SUPPORT_PRIORITIES.map((p) => ({
            value: p,
            label: t(`priority.${p}`),
          }))}
        />
      </div>
      <div className='grid gap-3 sm:grid-cols-2'>
        {FEATURE_FLAGS.map((key) => (
          <FormSwitchField
            key={key}
            form={form}
            name={key}
            label={t(`limits.${key}`)}
          />
        ))}
      </div>
    </fieldset>
  )
}
