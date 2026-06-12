/* eslint-disable react-refresh/only-export-components */
import { useEffect, useState } from 'react'
import {
  createFileRoute,
  Link,
  useNavigate,
  useRouter,
} from '@tanstack/react-router'
import { useAuth, UserButton } from '@clerk/react'
import { ExternalLink, Loader2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { ClerkLogo } from '@/assets/clerk-logo'
import { Button } from '@/components/ui/button'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { LearnMore } from '@/components/learn-more'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { UsersDialogs } from '@/features/users/components/users-dialogs'
import { UsersPrimaryButtons } from '@/features/users/components/users-primary-buttons'
import { UsersProvider } from '@/features/users/components/users-provider'
import { UsersTable } from '@/features/users/components/users-table'
import { users } from '@/features/users/data/users'

export const Route = createFileRoute('/clerk/_authenticated/user-management')({
  component: UserManagement,
})

function UserManagement() {
  const { t } = useTranslation()
  const search = Route.useSearch()
  const navigate = Route.useNavigate()

  const [opened, setOpened] = useState(true)
  const { isLoaded, isSignedIn } = useAuth()

  if (!isLoaded) {
    return (
      <div className='flex h-svh items-center justify-center'>
        <Loader2 className='size-8 animate-spin' />
      </div>
    )
  }

  if (!isSignedIn) {
    return <Unauthorized />
  }

  return (
    <UsersProvider>
      <Header fixed>
        <Search className='me-auto' />
        <ThemeSwitch />
        <ConfigDrawer />
        <UserButton />
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>
              {t('clerk.user_list')}
            </h2>
            <div className='flex gap-1'>
              <p className='text-muted-foreground'>
                {t('clerk.manage_users_desc')}
              </p>
              <LearnMore
                open={opened}
                onOpenChange={setOpened}
                contentProps={{ side: 'right' }}
              >
                <p>
                  {t('clerk.same_as_users').split("'/users'")[0]}
                  <Link
                    to='/users'
                    className='text-blue-500 underline decoration-dashed underline-offset-2'
                  >
                    '/users'
                  </Link>
                  {t('clerk.same_as_users').split("'/users'")[1]}
                </p>

                <p className='mt-4'>
                  {t('clerk.signout_tip')}
                  <ExternalLink className='inline-block size-4' />
                </p>
              </LearnMore>
            </div>
          </div>
          <UsersPrimaryButtons />
        </div>
        <UsersTable data={users} navigate={navigate} search={search} />
      </Main>

      <UsersDialogs />
    </UsersProvider>
  )
}

const COUNTDOWN = 5 // Countdown second

function Unauthorized() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { history } = useRouter()

  const [opened, setOpened] = useState(true)
  const [cancelled, setCancelled] = useState(false)
  const [countdown, setCountdown] = useState(COUNTDOWN)

  // Set and run the countdown conditionally
  useEffect(() => {
    if (cancelled || opened) return
    const interval = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(interval)
  }, [cancelled, opened])

  // Navigate to sign-in page when countdown hits 0
  useEffect(() => {
    if (countdown > 0) return
    navigate({ to: '/clerk/sign-in' })
  }, [countdown, navigate])

  return (
    <div className='h-svh'>
      <div className='m-auto flex h-full w-full flex-col items-center justify-center gap-2'>
        <h1 className='text-[7rem] leading-tight font-bold'>401</h1>
        <span className='font-medium'>{t('clerk.unauthorized')}</span>
        <p className='text-center text-muted-foreground'>
          {t('clerk.must_auth')}{' '}
          <sup>
            <LearnMore open={opened} onOpenChange={setOpened}>
              <p>
                {t('clerk.same_as_users').split("'/users'")[0]}
                <Link
                  to='/users'
                  className='text-blue-500 underline decoration-dashed underline-offset-2'
                >
                  '/users'
                </Link>
                {t('clerk.same_as_users').split("'/users'")[1]}
              </p>
              <p>{t('clerk.must_signin_tip')}</p>

              <p className='mt-4'>{t('clerk.after_signin_tip')}</p>
            </LearnMore>
          </sup>
        </p>
        <div className='mt-6 flex gap-4'>
          <Button variant='outline' onClick={() => history.go(-1)}>
            {t('clerk.go_back')}
          </Button>
          <Button onClick={() => navigate({ to: '/clerk/sign-in' })}>
            <ClerkLogo className='invert' /> {t('clerk.sign_in')}
          </Button>
        </div>
        <div className='mt-4 h-8 text-center'>
          {!cancelled && !opened && (
            <>
              <p>
                {countdown > 0
                  ? t('clerk.redirecting_in', { count: countdown })
                  : t('clerk.redirecting')}
              </p>
              <Button variant='link' onClick={() => setCancelled(true)}>
                {t('clerk.cancel_redirect')}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
