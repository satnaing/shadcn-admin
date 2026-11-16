import { useTranslation } from 'react-i18next'
import { AdminPageShell } from '@/components/admin/admin-page-shell'
import { usePreorderSettings } from '../hooks/use-preorder'
import { PreorderSettingsForm } from './preorder-settings-form'

export function PreorderSettingsPage() {
  const { t } = useTranslation('preorder')
  const { data } = usePreorderSettings()

  return (
    <AdminPageShell
      title={t('settings.title')}
      description={t('settings.description')}
    >
      {data ? (
        <PreorderSettingsForm key='loaded' defaults={data.data} />
      ) : (
        <div aria-busy='true' className='h-40' />
      )}
    </AdminPageShell>
  )
}
