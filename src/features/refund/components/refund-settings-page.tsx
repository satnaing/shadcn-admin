import { useTranslation } from 'react-i18next'
import { AdminPageShell } from '@/components/admin/admin-page-shell'
import { useRefundSettings } from '../hooks/use-refund'
import { RefundSettingsForm } from './refund-settings-form'

export function RefundSettingsPage() {
  const { t } = useTranslation('refund')
  const { data } = useRefundSettings()

  return (
    <AdminPageShell title={t('settings.title')} description={t('settings.description')}>
      {data ? <RefundSettingsForm key='loaded' defaults={data.data} /> : <div aria-busy='true' className='h-40' />}
    </AdminPageShell>
  )
}
