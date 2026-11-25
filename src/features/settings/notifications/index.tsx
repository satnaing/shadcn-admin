import { useTranslation } from 'react-i18next'
import { ContentSection } from '../components/content-section'
import { NotificationsForm } from './notifications-form'

export function SettingsNotifications() {
  const { t } = useTranslation()
  return (
    <ContentSection
      title={t('settings.notifications')}
      desc={t('settings.notifications_desc')}
    >
      <NotificationsForm />
    </ContentSection>
  )
}
