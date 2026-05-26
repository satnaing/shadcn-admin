import { useTranslation } from 'react-i18next'
import { Link } from '@tanstack/react-router'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { AuthLayout } from '../auth-layout'
import { SignUpForm } from './components/sign-up-form'

export function SignUp() {
  const { t } = useTranslation('auth')
  return (
    <AuthLayout>
      <Card className='gap-4'>
        <CardHeader>
          <CardTitle className='text-lg tracking-tight'>
            {t('createAccountTitle')}
          </CardTitle>
          <CardDescription>
            {t('createAccountDesc')} <br />
            {t('alreadyHaveAccount')}{' '}
            <Link
              to='/sign-in'
              className='hover:text-primary underline underline-offset-4'
            >
              {t('signInLink')}
            </Link>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SignUpForm />
        </CardContent>
        <CardFooter>
          <p className='text-muted-foreground px-8 text-center text-sm'>
            {t('createAccountAgreement')}{' '}
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
