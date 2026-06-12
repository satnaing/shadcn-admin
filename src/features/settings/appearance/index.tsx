import { useTranslation } from 'react-i18next'
import { ContentSection } from '../components/content-section'
import { AppearanceForm } from './appearance-form'

export function SettingsAppearance() {
  const { t } = useTranslation()
  return (
    <ContentSection
      title={t('settings.appearance')}
      desc={t('settings.appearance_desc')}
    >
      <AppearanceForm />
    </ContentSection>
  )
}
