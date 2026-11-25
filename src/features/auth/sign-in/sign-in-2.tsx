import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { Logo } from '@/assets/logo'
import { cn } from '@/lib/utils'
import dashboardDark from './assets/dashboard-dark.png'
import dashboardLight from './assets/dashboard-light.png'
import { UserAuthForm } from './components/user-auth-form'

export function SignIn2() {
  const { t } = useTranslation()

  return (
    <div className='relative container grid h-svh flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0'>
      <div className='lg:p-8'>
        <div className='mx-auto flex w-full flex-col justify-center space-y-2 py-8 sm:w-120 sm:p-8'>
          <div className='mb-4 flex items-center justify-center'>
            <Logo className='me-2' />
            <h1 className='text-xl font-medium'>Shadcn Admin</h1>
          </div>
        </div>
        <div className='mx-auto flex w-full max-w-sm flex-col justify-center space-y-2'>
          <div className='flex flex-col space-y-2 text-start'>
            <h2 className='text-lg font-semibold tracking-tight'>
              {t('auth.sign_in_title')}
            </h2>
            <p className='text-sm text-muted-foreground'>
              {t('auth.sign_in_desc')} {t('auth.no_account')}{' '}
              <Link
                to='/sign-up'
                className='text-nowrap underline underline-offset-4 hover:text-primary'
              >
                {t('auth.sign_up_title')}
              </Link>
            </p>
          </div>
          <UserAuthForm />
          <p className='px-8 text-center text-sm text-muted-foreground'>
            {t('auth.terms_prefix')}{' '}
            <a
              href='/terms'
              className='underline underline-offset-4 hover:text-primary'
            >
              {t('auth.terms_of_service')}
            </a>{' '}
            {t('auth.and')}{' '}
            <a
              href='/privacy'
              className='underline underline-offset-4 hover:text-primary'
            >
              {t('auth.privacy_policy')}
            </a>
            .
          </p>
        </div>
      </div>

      <div
        className={cn(
          'relative h-full overflow-hidden bg-muted max-lg:hidden',
          '[&>img]:absolute [&>img]:top-[15%] [&>img]:left-20 [&>img]:h-full [&>img]:w-full [&>img]:object-cover [&>img]:object-top-left [&>img]:select-none'
        )}
      >
        <img
          src={dashboardLight}
          className='dark:hidden'
          width={1024}
          height={1151}
          alt='Shadcn-Admin'
        />
        <img
          src={dashboardDark}
          className='hidden dark:block'
          width={1024}
          height={1138}
          alt='Shadcn-Admin'
        />
      </div>
    </div>
  )
}
