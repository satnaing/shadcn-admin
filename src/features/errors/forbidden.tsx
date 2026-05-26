import { useTranslation } from 'react-i18next'
import { useNavigate, useRouter } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'

export function ForbiddenError() {
  const { t } = useTranslation('errors')
  const { t: tc } = useTranslation('common')
  const navigate = useNavigate()
  const { history } = useRouter()
  return (
    <div className='h-svh'>
      <div className='m-auto flex h-full w-full flex-col items-center justify-center gap-2'>
        <h1 className='text-[7rem] leading-tight font-bold'>403</h1>
        <span className='font-medium'>{t('forbiddenTitle')}</span>
        <p className='text-muted-foreground text-center'>
          {t('forbiddenDesc1')} <br />
          {t('forbiddenDesc2')}
        </p>
        <div className='mt-6 flex gap-4'>
          <Button variant='outline' onClick={() => history.go(-1)}>
            {tc('goBack')}
          </Button>
          <Button onClick={() => navigate({ to: '/' })}>{tc('backToHome')}</Button>
        </div>
      </div>
    </div>
  )
}
