import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/custom/button'
import { cn } from '@/lib/utils'
import { useTranslations } from 'use-intl'

interface GeneralErrorProps extends React.HTMLAttributes<HTMLDivElement> {
  minimal?: boolean
}

export default function GeneralError({
  className,
  minimal = false,
}: GeneralErrorProps) {
  const navigate = useNavigate()
  const t = useTranslations('error')
  return (
    <div className={cn('h-svh w-full', className)}>
      <div className='flex flex-col items-center justify-center w-full h-full gap-2 m-auto'>
        {!minimal && (
          <h1 className='text-[7rem] font-bold leading-tight'>500</h1>
        )}
        <span className='font-medium'>{t('500_title')}</span>
        <p className='text-center text-muted-foreground'>
          {t.rich('500_desc', { br: () => <br /> })}
        </p>
        {!minimal && (
          <div className='flex gap-4 mt-6'>
            <Button variant='outline' onClick={() => navigate(-1)}>
              {t('go_back')}
            </Button>
            <Button onClick={() => navigate('/')}>{t('back_to_home')}</Button>
          </div>
        )}
      </div>
    </div>
  )
}
