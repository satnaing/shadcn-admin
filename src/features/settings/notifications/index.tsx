import { useTranslation } from 'react-i18next'
import { ContentSection } from '../components/content-section'
import { NotificationsForm } from './notifications-form'

export function SettingsNotifications() {
  const { t } = useTranslation('settings')
  return (
    <ContentSection
      title={t('notifications.sectionTitle')}
      desc={t('notifications.sectionDesc')}
    >
      <NotificationsForm />
    </ContentSection>
  )
}
