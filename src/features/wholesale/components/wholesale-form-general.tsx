import type { UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { FormImageField } from '@/components/forms/form-image-field'
import { FormInputField } from '@/components/forms/form-input-field'
import { FormTagField } from '@/components/forms/form-tag-field'
import { FormSectionCard } from '@/components/forms/form-section-card'
import { FormSelectField } from '@/components/forms/form-select-field'
import { FormRichTextField } from '@/components/forms/form-richtext-field'
import type { ProductFormValues } from '../data/wholesale.schema'
import { useWholesaleLookups } from '../hooks/use-wholesale'

const VIDEO = ['youtube', 'vimeo', 'dailymotion']

export function WholesaleFormGeneral({
  form,
}: {
  form: UseFormReturn<ProductFormValues>
}) {
  const { t } = useTranslation('wholesale')
  const { data } = useWholesaleLookups()
  const opts = (list?: { id: number; name: string }[]) =>
    (list ?? []).map((o) => ({ value: String(o.id), label: o.name }))

  return (
    <FormSectionCard title={t('form.general')}>
      <div className='grid gap-4 md:grid-cols-2'>
        <FormInputField
          form={form}
          name='name'
          label={t('form.name')}
          className='md:col-span-2'
        />
        <FormSelectField
          form={form}
          name='brand_id'
          numeric
          label={t('form.brand')}
          options={opts(data?.data.brands)}
        />
        {/* AEC wholesale forms typed free text here (the wholesale_unit_fix bug); a unit id is stored. */}
        <FormSelectField
          form={form}
          name='unit_id'
          numeric
          label={t('form.unit')}
          options={opts(data?.data.units)}
        />
        <FormInputField
          form={form}
          name='min_qty'
          type='number'
          label={t('form.minQty')}
          hint={t('form.minQtyHint')}
        />
        <FormInputField form={form} name='barcode' label={t('form.barcode')} />
        <FormTagField
          form={form}
          name='tags'
          label={t('form.tags')}
          hint={t('form.tagsHint')}
          className='md:col-span-2'
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
    </FormSectionCard>
  )
}
