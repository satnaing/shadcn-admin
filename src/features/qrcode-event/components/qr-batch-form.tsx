import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { EntityFormPage } from '@/components/forms/entity-form-page'
import { FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { type BatchFormValues, batchDefaults, batchSchema } from '../data/qrcode-event.schema'
import { useQrCampaigns, useQrProducts } from '../hooks/use-qrcode-event'
import { useQrMutations } from '../hooks/use-qrcode-event-mutations'
import { QrBatchAllocation } from './qr-batch-allocation'
import { QrInputField } from './qr-input-field'
import { QrSelectField } from './qr-select-field'

const NONE = 'none'

export function QrBatchForm({ campaignId }: { campaignId?: string }) {
  const { t } = useTranslation('qrcode_event')
  const navigate = useNavigate()
  const { createBatch } = useQrMutations()
  const { data: campaigns } = useQrCampaigns({ per_page: 100, sort: 'name' })
  const { data: products } = useQrProducts()
  const form = useForm<BatchFormValues>({
    resolver: zodResolver(batchSchema),
    defaultValues: { ...batchDefaults, campaign_id: Number(campaignId) || 0 },
  })
  const campaign = form.watch('campaign_id')

  const submit = form.handleSubmit((values) =>
    createBatch.mutate(values, { onSuccess: () => navigate({ to: '/admin/qrcode-event/batches' }) })
  )

  return (
    <EntityFormPage
      backTo='/admin/qrcode-event/batches'
      form={form}
      title={t('batches.form.title')}
      description={t('batches.form.description')}
      isCreate
      isPending={createBatch.isPending}
      labels={{ saving: t('batches.form.generating'), saveAndExit: t('batches.form.generate'), updating: '', updateAndExit: '' }}
      onSubmit={submit}
    >
      <div className='grid gap-4 md:grid-cols-2'>
        <QrSelectField
          form={form}
          name='campaign_id'
          numeric
          label={t('batches.form.campaign')}
          placeholder={t('batches.form.campaignPlaceholder')}
          options={(campaigns?.data ?? []).map((c) => ({ value: String(c.id), label: c.name }))}
        />
        <QrInputField form={form} name='quantity' type='number' label={t('batches.form.quantity')} hint={t('batches.form.quantityHint')} />
        <FormField
          control={form.control}
          name='product_id'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('batches.form.product')}</FormLabel>
              <Select value={field.value ? String(field.value) : NONE} onValueChange={(v) => field.onChange(v === NONE ? null : Number(v))}>
                <SelectTrigger className='w-full'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NONE}>{t('batches.form.noProduct')}</SelectItem>
                  {(products?.data ?? []).map((p) => (
                    <SelectItem key={p.id} value={String(p.id)}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        <QrInputField form={form} name='note' label={t('batches.form.note')} />
      </div>
      <QrBatchAllocation form={form} campaignId={campaign} />
    </EntityFormPage>
  )
}
