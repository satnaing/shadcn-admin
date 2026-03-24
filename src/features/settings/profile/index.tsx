import { ContentSection } from '../components/content-section'
import { ProfileForm } from './profile-form'
import { useTranslation } from 'react-i18next'

export function SettingsProfile() {
  const { t } = useTranslation('settings')
  return (
    <ContentSection
      title={t('profileTitle')}
      desc={t('profileDesc')}
    >
      <ProfileForm />
    </ContentSection>
  )
}
