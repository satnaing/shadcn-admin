import { Button } from '@/components/custom/button'
import { useTranslations } from 'use-intl'

export default function MaintenanceError() {
  const t = useTranslations('error')
  return (
    <div className='h-svh'>
      <div className='flex flex-col items-center justify-center w-full h-full gap-2 m-auto'>
        <h1 className='text-[7rem] font-bold leading-tight'>503</h1>
        <span className='font-medium'>{t('maintenance_title')}</span>
        <p className='text-center text-muted-foreground'>
          {t.rich('maintenance_desc', { br: () => <br /> })}
        </p>
        <div className='flex gap-4 mt-6'>
          <Button variant='outline'>{t('learn_more')}</Button>
        </div>
      </div>
    </div>
  )
}
