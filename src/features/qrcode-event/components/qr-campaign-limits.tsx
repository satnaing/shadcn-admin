import type { UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import type { CampaignFormValues } from '../data/qrcode-event.schema'
import { QrInputField } from './qr-input-field'

/** Abuse protection: per-hour check limits and the block duration after too many failures. */
export function QrCampaignLimits({ form }: { form: UseFormReturn<CampaignFormValues> }) {
  const { t } = useTranslation('qrcode_event')

  return (
    <fieldset className='space-y-3 rounded-md border p-4'>
      <legend className='px-1 text-sm font-medium'>{t('campaigns.form.limits')}</legend>
      <div className='grid gap-4 md:grid-cols-3'>
        <QrInputField form={form} name='max_checks_per_hour' type='number' label={t('campaigns.form.maxChecks')} />
        <QrInputField form={form} name='max_failed_per_hour' type='number' label={t('campaigns.form.maxFailed')} />
        <QrInputField form={form} name='block_minutes' type='number' label={t('campaigns.form.blockMinutes')} />
      </div>
    </fieldset>
  )
}
