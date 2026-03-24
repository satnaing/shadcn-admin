import { ContentSection } from '../components/content-section'
import { NotificationsForm } from './notifications-form'
import { useTranslation } from 'react-i18next'

export function SettingsNotifications() {
  const { t } = useTranslation('settings')
  return (
    <ContentSection
      title={t('notificationsTitle')}
      desc={t('notificationsDesc')}
    >
      <NotificationsForm />
    </ContentSection>
  )
}
