import { useTranslation } from 'react-i18next'
import { useSearch } from '@tanstack/react-router'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { AuthLayout } from '../auth-layout'
import { UserAuthForm } from './components/user-auth-form'

export function SignIn() {
  const { t } = useTranslation('auth')
  const { redirect } = useSearch({ from: '/(auth)/sign-in' })

  return (
    <AuthLayout>
      <Card className='gap-4'>
        <CardHeader>
          <CardTitle className='text-lg tracking-tight'>{t('signInTitle')}</CardTitle>
          <CardDescription>
            {t('signInDesc1')} <br />
            {t('signInDesc2')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UserAuthForm redirectTo={redirect} />
        </CardContent>
        <CardFooter>
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
        </CardFooter>
      </Card>
    </AuthLayout>
  )
}
