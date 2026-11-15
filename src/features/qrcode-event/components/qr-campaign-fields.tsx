import type { UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { ImagePicker } from '@/components/image-picker'
import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { type CampaignFormValues } from '../data/qrcode-event.schema'
import { CAMPAIGN_STATUSES } from '../data/qrcode-event.type'
import { QrInputField } from './qr-input-field'
import { QrSelectField } from './qr-select-field'

export function QrCampaignFields({ form }: { form: UseFormReturn<CampaignFormValues> }) {
  const { t } = useTranslation('qrcode_event')
  const text = (name: 'description' | 'terms') => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t(`campaigns.form.${name}`)}</FormLabel>
          <FormControl>
            <Textarea rows={4} {...field} />
          </FormControl>
        </FormItem>
      )}
    />
  )

  return (
    <div className='space-y-6'>
      <div className='grid gap-4 md:grid-cols-2'>
        <QrInputField form={form} name='name' label={t('campaigns.form.name')} />
        <QrInputField form={form} name='slug' label={t('campaigns.form.slug')} hint={t('campaigns.form.slugHint')} />
        <QrSelectField
          form={form}
          name='status'
          label={t('campaigns.form.status')}
          options={CAMPAIGN_STATUSES.map((s) => ({ value: s, label: t(`campaign.${s}`) }))}
        />
        <QrSelectField
          form={form}
          name='prize_delivery'
          label={t('campaigns.form.prizeDelivery')}
          options={(['manual', 'wallet'] as const).map((s) => ({ value: s, label: t(`delivery.${s}`) }))}
        />
        <QrInputField form={form} name='starts_at' type='datetime-local' label={t('campaigns.form.startsAt')} />
        <QrInputField form={form} name='ends_at' type='datetime-local' label={t('campaigns.form.endsAt')} />
        <QrInputField
          form={form}
          name='code_prefix'
          label={t('campaigns.form.codePrefix')}
          hint={t('campaigns.form.codePrefixHint')}
        />
        <FormField
          control={form.control}
          name='is_login_required'
          render={({ field }) => (
            <FormItem className='flex items-center justify-between rounded-md border p-3'>
              <FormLabel>{t('campaigns.form.loginRequired')}</FormLabel>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
      <FormField
        control={form.control}
        name='banner'
        render={({ field }) => (
          <FormItem>
            <ImagePicker label={t('campaigns.form.banner')} value={field.value} onChange={field.onChange} />
          </FormItem>
        )}
      />
      {text('description')}
      {text('terms')}
    </div>
  )
}
