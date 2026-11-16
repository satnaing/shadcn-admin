import { useTranslation } from 'react-i18next'
import { AdminPageShell } from '@/components/admin/admin-page-shell'
import { usePosSettings } from '../hooks/use-pos'
import { PosActivationCard } from './pos-activation-card'
import { PosPrintCard } from './pos-print-card'

/** Seller activation (admin) and thermal printer width. Cards are keyed by their server value so a refetch never wipes an unsaved edit of the other card. */
export function PosConfigPage() {
  const { t } = useTranslation('pos')
  const settings = usePosSettings().data?.data

  return (
    <AdminPageShell title={t('config.title')} description={t('config.description')}>
      {settings ? (
        <div className='grid max-w-2xl gap-6'>
          <PosActivationCard settings={settings} />
          <PosPrintCard key={`w-${settings.print_width}`} settings={settings} />
        </div>
      ) : (
        <div aria-busy='true' className='h-40' />
      )}
    </AdminPageShell>
  )
}
