import { useTranslation } from 'react-i18next'
import { ContentSection } from '../components/content-section'
import { AccountForm } from './account-form'

export function SettingsAccount() {
  const { t } = useTranslation()
  return (
    <ContentSection
      title={t('settings.account')}
      desc={t('settings.account_desc')}
    >
      <AccountForm />
    </ContentSection>
  )
}
