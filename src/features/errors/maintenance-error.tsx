import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'

export function MaintenanceError() {
  const { t } = useTranslation('errors')
  const { t: tc } = useTranslation('common')
  return (
    <div className='h-svh'>
      <div className='m-auto flex h-full w-full flex-col items-center justify-center gap-2'>
        <h1 className='text-[7rem] leading-tight font-bold'>503</h1>
        <span className='font-medium'>{t('maintenanceTitle')}</span>
        <p className='text-muted-foreground text-center'>
          {t('maintenanceDesc1')} <br />
          {t('maintenanceDesc2')}
        </p>
        <div className='mt-6 flex gap-4'>
          <Button variant='outline'>{tc('learnMore')}</Button>
        </div>
      </div>
    </div>
  )
}
