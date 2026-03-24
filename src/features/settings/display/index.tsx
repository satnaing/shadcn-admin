import { ContentSection } from '../components/content-section'
import { DisplayForm } from './display-form'
import { useTranslation } from 'react-i18next'

export function SettingsDisplay() {
  const { t } = useTranslation('settings')
  return (
    <ContentSection
      title={t('displayTitle')}
      desc={t('displayDesc')}
    >
      <DisplayForm />
    </ContentSection>
  )
}
