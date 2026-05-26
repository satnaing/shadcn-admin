import { useTranslation } from 'react-i18next'
import { Logo } from '@/assets/logo'
import { LanguageSwitch } from '@/components/language-switch'
import { ThemeSwitch } from '@/components/theme-switch'
import { cn } from '@/lib/utils'
import dashboardDark from './assets/dashboard-dark.png'
import dashboardLight from './assets/dashboard-light.png'
import { UserAuthForm } from './components/user-auth-form'

export function SignIn2() {
  const { t } = useTranslation('auth')

  return (
    <div className='relative container grid h-svh flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0'>
      <div className='lg:p-8'>
        <div className='mx-auto flex w-full flex-col justify-center space-y-2 py-8 sm:w-[480px] sm:p-8'>
          <div className='mb-4 flex items-center justify-center'>
            <Logo className='me-2' />
            <h1 className='text-xl font-medium'>Shadcn Admin</h1>
            <div className='ms-auto flex items-center space-x-2'>
              <ThemeSwitch />
              <LanguageSwitch />
            </div>
          </div>
        </div>
        <div className='mx-auto flex w-full max-w-sm flex-col justify-center space-y-2'>
          <div className='flex flex-col space-y-2 text-start'>
            <h2 className='text-lg font-semibold tracking-tight'>{t('signInTitle')}</h2>
            <p className='text-muted-foreground text-sm'>
              {t('signInDesc1')} <br />
              {t('signInDesc2')}
            </p>
          </div>
          <UserAuthForm />
          <p className='text-muted-foreground px-8 text-center text-sm'>
            {t('signInAgreement')}{' '}
            <a
              href='/terms'
              className='hover:text-primary underline underline-offset-4'
            >
              {t('termsOfService')}
            </a>{' '}
            {t('and')}{' '}
            <a
              href='/privacy'
              className='hover:text-primary underline underline-offset-4'
            >
              {t('privacyPolicy')}
            </a>
            .
          </p>
        </div>
      </div>

      <div
        className={cn(
          'bg-muted relative h-full overflow-hidden max-lg:hidden',
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
