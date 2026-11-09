import { useTranslation } from 'react-i18next'
import { Telescope } from 'lucide-react'

export function ComingSoon() {
  const { t } = useTranslation()
  return (
    <div className='h-svh'>
      <div className='m-auto flex h-full w-full flex-col items-center justify-center gap-2'>
        <Telescope size={72} />
        <h1 className='text-4xl leading-tight font-bold'>
          {t('common:misc.comingSoonTitle')}
        </h1>
        <p className='text-center text-muted-foreground'>
          {t('common:misc.comingSoonDesc')} <br />
          {t('common:misc.comingSoonDesc2')}
        </p>
      </div>
    </div>
  )
}
