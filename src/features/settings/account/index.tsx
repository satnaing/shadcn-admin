import { ContentSection } from '../components/content-section'
import { AccountForm } from './account-form'
import { useTranslation } from 'react-i18next'

export function SettingsAccount() {
  const { t } = useTranslation('settings')

  return (
    <ContentSection
      title={t('accountTitle') || 'Account'}
      desc={t('accountDesc') || 'Update your account settings. Set your preferred language.'}
    >
      <AccountForm />
    </ContentSection>
  )
}
