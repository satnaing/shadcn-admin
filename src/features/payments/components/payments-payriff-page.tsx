import { useTranslation } from 'react-i18next'
import { AdminPageShell } from '@/components/admin/admin-page-shell'
import { usePayriff } from '../hooks/use-payments'
import { PaymentsPayriffCard } from './payments-payriff-card'

/** AEC "Payriff" configuration screen (`payriff.index`). */
export function PaymentsPayriffPage() {
  const { t } = useTranslation('payments')
  const settings = usePayriff().data?.data

  return (
    <AdminPageShell title={t('payriff.title')} description={t('payriff.description')}>
      {settings ? (
        <div className='max-w-3xl'>
          <PaymentsPayriffCard key={JSON.stringify(settings)} settings={settings} />
        </div>
      ) : (
        <div aria-busy='true' className='h-40' />
      )}
    </AdminPageShell>
  )
}
