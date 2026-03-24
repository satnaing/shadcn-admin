import { ContentSection } from '../components/content-section'
import { AppearanceForm } from './appearance-form'
import { useTranslation } from 'react-i18next'

export function SettingsAppearance() {
  const { t } = useTranslation('settings')
  return (
    <ContentSection
      title={t('appearanceTitle')}
      desc={t('appearanceDesc')}
    >
      <AppearanceForm />
    </ContentSection>
  )
}
