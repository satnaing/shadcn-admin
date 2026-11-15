import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { EntityFormDialog } from '@/components/forms/entity-form-dialog'
import { ImagePicker } from '@/components/image-picker'
import { FormField, FormItem } from '@/components/ui/form'
import { type PrizeFormValues, prizeDefaults, prizeSchema, prizeToForm } from '../data/qrcode-event.schema'
import { PRIZE_TYPES, type PrizeItem } from '../data/qrcode-event.type'
import { useQrMutations } from '../hooks/use-qrcode-event-mutations'
import { QrInputField } from './qr-input-field'
import { QrPrizeProductsField } from './qr-prize-products-field'
import { QrSelectField } from './qr-select-field'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  campaignId: number | string
  /** Prize being edited; `undefined` = create. Remount with `key`. */
  prize?: PrizeItem
}

export function QrPrizeDialog({ open, onOpenChange, campaignId, prize }: Props) {
  const { t } = useTranslation('qrcode_event')
  const { createPrize, updatePrize } = useQrMutations()
  const form = useForm<PrizeFormValues>({
    resolver: zodResolver(prizeSchema),
    defaultValues: prize ? prizeToForm(prize) : prizeDefaults,
  })
  const type = form.watch('type')
  const mutation = prize ? updatePrize : createPrize

  const submit = form.handleSubmit((values) => {
    const onSuccess = () => onOpenChange(false)
    if (prize) updatePrize.mutate({ id: prize.id, values }, { onSuccess })
    else createPrize.mutate({ id: campaignId, values }, { onSuccess })
  })

  return (
    <EntityFormDialog
      open={open}
      onOpenChange={onOpenChange}
      form={form}
      title={t(prize ? 'prizes.form.editTitle' : 'prizes.form.createTitle')}
      description={t('prizes.form.description')}
      isCreate={!prize}
      isPending={mutation.isPending}
      labels={{ saving: t('actions.saving'), saveAndExit: t('actions.save'), updating: t('actions.saving'), updateAndExit: t('actions.save') }}
      onSubmit={submit}
      contentClassName='sm:max-w-xl'
    >
      <div className='grid gap-4 sm:grid-cols-2'>
        <QrSelectField
          form={form}
          name='type'
          label={t('prizes.form.type')}
          options={PRIZE_TYPES.map((p) => ({ value: p, label: t(`prize.${p}`) }))}
        />
        <QrInputField form={form} name='title' label={t('prizes.form.title')} />
        {type === 'cash' && <QrInputField form={form} name='value' type='number' label={t('prizes.form.value')} />}
        <QrInputField form={form} name='quantity' type='number' label={t('prizes.form.quantity')} />
        <QrInputField form={form} name='sort_order' type='number' label={t('prizes.form.sortOrder')} />
      </div>
      {type === 'product' && <QrPrizeProductsField form={form} />}
      {type !== 'cash' && <QrInputField form={form} name='description' label={t('prizes.form.descriptionField')} />}
      {type === 'gift' && (
        <FormField
          control={form.control}
          name='image'
          render={({ field }) => (
            <FormItem>
              <ImagePicker label={t('prizes.form.image')} value={field.value} onChange={field.onChange} />
            </FormItem>
          )}
        />
      )}
    </EntityFormDialog>
  )
}
