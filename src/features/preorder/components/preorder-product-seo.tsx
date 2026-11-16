import type { UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { FormImageField } from '@/components/forms/form-image-field'
import { FormInputField } from '@/components/forms/form-input-field'
import { FormTextareaField } from '@/components/forms/form-textarea-field'
import type { ProductFormValues } from '../data/preorder.schema'
import { PreorderFormSection } from './preorder-form-section'

export function PreorderProductSeo({
  form,
}: {
  form: UseFormReturn<ProductFormValues>
}) {
  const { t } = useTranslation('preorder')

  return (
    <PreorderFormSection title={t('form.seo')}>
      <FormInputField
        form={form}
        name='meta_title'
        label={t('form.metaTitle')}
      />
      <FormTextareaField
        form={form}
        name='meta_description'
        label={t('form.metaDescription')}
        rows={3}
      />
      <FormImageField
        form={form}
        name='meta_image'
        label={t('form.metaImage')}
      />
    </PreorderFormSection>
  )
}
