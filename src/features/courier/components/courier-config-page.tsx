import { useTranslation } from 'react-i18next'
import { AdminPageShell } from '@/components/admin/admin-page-shell'
import { useCourierSettings } from '../hooks/use-courier'
import { CourierNotificationCard } from './courier-notification-card'
import { CourierPaymentCard } from './courier-payment-card'
import { CourierPickupCard } from './courier-pickup-card'

/** Three independent cards (payment, notifications, pickup point); each saves on its own like AEC. */
export function CourierConfigPage() {
  const { t } = useTranslation('courier')
  const settings = useCourierSettings().data?.data

  return (
    <AdminPageShell
      title={t('config.title')}
      description={t('config.description')}
    >
      {settings ? (
        <div className='grid max-w-3xl gap-6'>
          <CourierPaymentCard
            key={`p-${settings.payment_type}-${settings.salary}-${settings.commission}`}
            settings={settings}
          />
          <CourierNotificationCard
            key={`n-${settings.mail_notification}-${settings.otp_notification}`}
            settings={settings}
          />
          <CourierPickupCard
            key={`g-${settings.pickup_latitude}-${settings.pickup_longitude}`}
            settings={settings}
          />
        </div>
      ) : (
        <div aria-busy='true' className='h-40' />
      )}
    </AdminPageShell>
  )
}
