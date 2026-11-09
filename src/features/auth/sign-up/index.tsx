import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
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
      <Card className='max-w-sm gap-4'>
        <CardHeader>
          <CardTitle className='text-lg tracking-tight'>
            {t('signUp.title')}
          </CardTitle>
          <CardDescription>
            {t('signUp.descLine1')} <br />
            {t('signUp.descLine2')}{' '}
            <Link
              to='/sign-in'
              className='underline underline-offset-4 hover:text-primary'
            >
              {t('signUp.signInLink')}
            </Link>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SignUpForm />
        </CardContent>
        <CardFooter>
          <p className='px-8 text-center text-sm text-muted-foreground'>
            {t('signUp.termsPrefix')}{' '}
            <a
              href='/terms'
              className='underline underline-offset-4 hover:text-primary'
            >
              {t('common.termsOfService')}
            </a>{' '}
            {t('common.and')}{' '}
            <a
              href='/privacy'
              className='underline underline-offset-4 hover:text-primary'
            >
              {t('common.privacyPolicy')}
            </a>
            .
          </p>
        </CardFooter>
      </Card>
    </AuthLayout>
  )
}
