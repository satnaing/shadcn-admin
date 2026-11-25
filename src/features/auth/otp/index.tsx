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
import { OtpForm } from './components/otp-form'

export function Otp() {
  const { t } = useTranslation()
  return (
    <AuthLayout>
      <Card className='max-w-md gap-4'>
        <CardHeader>
          <CardTitle className='text-base tracking-tight'>
            {t('auth.otp_title')}
          </CardTitle>
          <CardDescription>{t('auth.otp_desc')}</CardDescription>
        </CardHeader>
        <CardContent>
          <OtpForm />
        </CardContent>
        <CardFooter>
          <p className='px-8 text-center text-sm text-muted-foreground'>
            {t('auth.havent_received')}{' '}
            <Link
              to='/sign-in'
              className='underline underline-offset-4 hover:text-primary'
            >
              {t('auth.resend_code')}
            </Link>
            .
          </p>
        </CardFooter>
      </Card>
    </AuthLayout>
  )
}
