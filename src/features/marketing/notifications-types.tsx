import { AdminHeader } from '@/components/admin/admin-header'
import { Main } from '@/components/layout/main'
import { NotificationMatrixTable } from './components/notification-matrix-table'
import type { NotificationTypeItem } from './data/marketing.type'
import { useNotificationTypes } from './hooks/useMarketing'
import { useMessagingMutations } from './hooks/useMessagingMutations'

export function NotificationTypesPage() {
  const { data: types = [], isLoading } = useNotificationTypes()
  const { saveNotificationType } = useMessagingMutations()

  const handleToggle = (item: NotificationTypeItem, channel: 'email' | 'sms' | 'push' | 'system') => {
    const updated = {
      id: item.id,
      email_channel: channel === 'email' ? !item.email_channel : item.email_channel,
      sms_channel: channel === 'sms' ? !item.sms_channel : item.sms_channel,
      push_channel: channel === 'push' ? !item.push_channel : item.push_channel,
      system_channel: channel === 'system' ? !item.system_channel : item.system_channel,
    }
    saveNotificationType.mutate(updated)
  }

  return (
    <>
      <AdminHeader />
      <Main className='space-y-4 p-6'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>Bildiriş Növləri və Kanalları</h1>
          <p className='text-sm text-muted-foreground'>
            Hər bir sistem hadisəsi üçün hansı rabitə kanallarının aktiv olacağını tənzimləyin
          </p>
        </div>
        {isLoading ? (
          <div className='py-8 text-center text-sm text-muted-foreground'>Yüklənir...</div>
        ) : (
          <NotificationMatrixTable types={types} onToggleChannel={handleToggle} />
        )}
      </Main>
    </>
  )
}
