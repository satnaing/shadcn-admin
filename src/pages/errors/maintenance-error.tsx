import { Button } from '@/components/custom/button'
import { useTranslations } from 'use-intl'

export default function MaintenanceError() {
  const t = useTranslations('error')
  return (
    <div className='h-svh'>
      <div className='m-auto flex h-full w-full flex-col items-center justify-center gap-2'>
        <h1 className='text-[7rem] font-bold leading-tight'>503</h1>
        <span className='font-medium'>{t('maintenance_title')}</span>
        <p className='text-center text-muted-foreground'>
          {t.rich('maintenance_desc', { br: () => <br /> })}
        </p>
        <div className='mt-6 flex gap-4'>
          <Button variant='outline'>{t('learn_more')}</Button>
        </div>
      </div>
    </div>
  )
}
