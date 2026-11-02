import { useTranslation } from 'react-i18next'
import { ContentSection } from '../components/content-section'
import { AccountForm } from './account-form'

export function SettingsAccount() {
  const { t } = useTranslation('settings')

  return (
    <ContentSection title={t('account.title')} desc={t('account.description')}>
      <AccountForm />
    </ContentSection>
  )
}
