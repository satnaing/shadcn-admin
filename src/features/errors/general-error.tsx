import { useTranslation } from 'react-i18next'
import { useNavigate, useRouter } from '@tanstack/react-router'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

type GeneralErrorProps = React.HTMLAttributes<HTMLDivElement> & {
  minimal?: boolean
}

export function GeneralError({
  className,
  minimal = false,
}: GeneralErrorProps) {
  const { t } = useTranslation('errors')
  const { t: tc } = useTranslation('common')
  const navigate = useNavigate()
  const { history } = useRouter()
  return (
    <div className={cn('h-svh w-full', className)}>
      <div className='m-auto flex h-full w-full flex-col items-center justify-center gap-2'>
        {!minimal && (
          <h1 className='text-[7rem] leading-tight font-bold'>500</h1>
        )}
        <span className='font-medium'>{t('serverErrorTitle')}</span>
        <p className='text-muted-foreground text-center'>
          {t('serverErrorDesc1')} <br /> {t('serverErrorDesc2')}
        </p>
        {!minimal && (
          <div className='mt-6 flex gap-4'>
            <Button variant='outline' onClick={() => history.go(-1)}>
              {tc('goBack')}
            </Button>
            <Button onClick={() => navigate({ to: '/' })}>{tc('backToHome')}</Button>
          </div>
        )}
      </div>
    </div>
  )
}
