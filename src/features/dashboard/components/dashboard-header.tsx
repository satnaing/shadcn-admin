import { useTranslation } from 'react-i18next'

export function DashboardHeader() {
  const { t, i18n } = useTranslation('dashboard')
  const now = new Date()
  const locale = i18n.language === 'az' ? 'az-AZ' : i18n.language === 'tr' ? 'tr-TR' : 'en-US'

  const dayNumber = now.getDate().toString().padStart(2, '0')
  const weekday = now.toLocaleDateString(locale, { weekday: 'long' })
  const monthYear = now.toLocaleDateString(locale, { month: 'long', year: 'numeric' })

  return (
    <div className='flex flex-wrap items-center justify-between gap-4'>
      <div>
        <h1 className='text-xl font-bold tracking-tight text-foreground'>
          {t('header.title')}
        </h1>
        <p className='text-xs text-muted-foreground'>{t('header.subtitle')}</p>
      </div>

      <div className='flex items-center gap-2 text-xs text-muted-foreground'>
        <div className='flex h-10 w-10 items-center justify-center rounded-full bg-muted font-bold text-foreground'>
          {dayNumber}
        </div>
        <div className='flex flex-col'>
          <span className='font-medium text-foreground'>{weekday}</span>
          <span>{monthYear}</span>
        </div>
      </div>
    </div>
  )
}
