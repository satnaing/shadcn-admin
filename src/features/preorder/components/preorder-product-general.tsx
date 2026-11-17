import type { UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { FormImageField } from '@/components/forms/form-image-field'
import { FormInputField } from '@/components/forms/form-input-field'
import { FormSelectField } from '@/components/forms/form-select-field'
import { FormRichTextField } from '@/components/forms/form-richtext-field'
import type { ProductFormValues } from '../data/preorder.schema'
import { usePreorderLookups } from '../hooks/use-preorder'
import { PreorderFormSection } from './preorder-form-section'

const VIDEO = ['youtube', 'vimeo', 'dailymotion']

export function PreorderProductGeneral({
  form,
}: {
  form: UseFormReturn<ProductFormValues>
}) {
  const { t } = useTranslation('preorder')
  const { data } = usePreorderLookups()
  const opts = (list?: { id: number; name: string }[]) =>
    (list ?? []).map((o) => ({ value: String(o.id), label: o.name }))

  return (
    <PreorderFormSection title={t('form.general')}>
      <div className='grid gap-4 md:grid-cols-2'>
        <FormInputField
          form={form}
          name='name'
          label={t('form.name')}
          className='md:col-span-2'
        />
        <FormSelectField
          form={form}
          name='category_id'
          numeric
          label={t('form.category')}
          options={opts(data?.data.categories)}
        />
        <FormSelectField
          form={form}
          name='brand_id'
          numeric
          label={t('form.brand')}
          options={opts(data?.data.brands)}
        />
        <FormInputField
          form={form}
          name='unit'
          label={t('form.unit')}
          hint={t('form.unitHint')}
        />
        <FormInputField
          form={form}
          name='weight'
          type='number'
          label={t('form.weight')}
        />
        <FormInputField
          form={form}
          name='min_qty'
          type='number'
          label={t('form.minQty')}
        />
        <FormInputField form={form} name='barcode' label={t('form.barcode')} />
        <FormInputField
          form={form}
          name='available_date'
          type='date'
          label={t('form.availableDate')}
          hint={t('form.availableDateHint')}
        />
        <FormSelectField
          form={form}
          name='video_provider'
          label={t('form.videoProvider')}
          options={[
            { value: 'none', label: t('form.none') },
            ...VIDEO.map((v) => ({ value: v, label: v })),
          ]}
        />
        <FormInputField
          form={form}
          name='video_link'
          label={t('form.videoLink')}
          className='md:col-span-2'
        />
      </div>
      <FormImageField
        form={form}
        name='thumbnail'
        label={t('form.thumbnail')}
      />
      <FormRichTextField
        form={form}
        name='description'
        label={t('form.descriptionField')}
      />
    </PreorderFormSection>
  )
}
