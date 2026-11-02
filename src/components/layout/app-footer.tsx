import { APP_NAME, APP_VERSION } from '@/shared/constant'
import { useTranslation } from 'react-i18next'
import { Footer } from './footer'

export function AppFooter() {
  const { t } = useTranslation('common')
  const year = new Date().getFullYear()

  return (
    <Footer fixed>
      <span>{t('footer.copyright', { year, company: APP_NAME })}</span>
      <span className='tabular-nums'>
        {t('footer.version', { version: APP_VERSION })}
      </span>
    </Footer>
  )
}
