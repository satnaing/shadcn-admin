import { Link } from '@tanstack/react-router'
import { Card } from '@/components/ui/card'
import AuthLayout from '../auth-layout'
import { OtpForm } from './components/otp-form'

export default function Otp() {
  return (
    <AuthLayout>
      <Card className='p-6'>
        <div className='mb-2 flex flex-col space-y-2 text-left'>
          <h1 className='text-md font-semibold tracking-tight'>
            Two-factor Authentication
          </h1>
          <p className='text-muted-foreground text-sm'>
            Please enter the authentication code. <br /> We have sent the
            authentication code to your email.
          </p>
        </div>
        <OtpForm />
        <p className='text-muted-foreground mt-4 px-8 text-center text-sm'>
          Haven't received it?{' '}
          <Link
            to='/sign-in'
            className='hover:text-primary underline underline-offset-4'
          >
            Resend a new code.
          </Link>
          .
        </p>
      </Card>
    </AuthLayout>
  )
}
