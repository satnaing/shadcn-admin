import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/custom/button'
import { useTranslations } from 'use-intl'

export default function UnauthorisedError() {
  const navigate = useNavigate()
  const t = useTranslations('error')
  return (
    <div className='h-svh'>
      <div className='m-auto flex h-full w-full flex-col items-center justify-center gap-2'>
        <h1 className='text-[7rem] font-bold leading-tight'>401</h1>
        <span className='font-medium'>{t('unauthorised_title')}</span>
        <p className='text-center text-muted-foreground'>
          {t.rich('unauthorised_desc', { br: () => <br /> })}
        </p>
        <div className='mt-6 flex gap-4'>
          <Button variant='outline' onClick={() => navigate(-1)}>
            {t('go_back')}
          </Button>
          <Button onClick={() => navigate('/')}>{t('back_to_home')}</Button>
        </div>
      </div>
    </div>
  )
}
