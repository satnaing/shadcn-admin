import { useNavigate, useRouter } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'

export function NotFoundError() {
  const navigate = useNavigate()
  const { history } = useRouter()
  const { t } = useTranslation()
  return (
    <div className='h-svh'>
      <div className='m-auto flex h-full w-full flex-col items-center justify-center gap-2'>
        <h1 className='text-[7rem] leading-tight font-bold'>404</h1>
        <span className='font-medium'>{t('errors.not_found_title')}</span>
        <p className='text-center text-muted-foreground'>
          {t('errors.not_found_desc')}
        </p>
        <div className='mt-6 flex gap-4'>
          <Button variant='outline' onClick={() => history.go(-1)}>
            {t('errors.go_back')}
          </Button>
          <Button onClick={() => navigate({ to: '/' })}>
            {t('errors.back_to_home')}
          </Button>
        </div>
      </div>
    </div>
  )
}
