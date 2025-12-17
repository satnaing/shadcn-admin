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
import { LockScreenForm } from './components/lock-screen-form'

export function LockScreen() {
  return (
    <AuthLayout>
      <Card className='gap-4'>
        <CardHeader className='text-center'>
          <CardTitle className='text-base tracking-tight'>
            Screen Locked
          </CardTitle>
          <CardDescription>
            Your screen has been locked. <br /> Please enter your password to
            continue.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LockScreenForm />
        </CardContent>
        <CardFooter>
          <p className='text-muted-foreground px-16 text-center text-sm'>
            Not you?{' '}
            <Link
              to='/sign-in'
              className='hover:text-primary underline underline-offset-4'
            >
              Sign in as a different user.
            </Link>
          </p>
        </CardFooter>
      </Card>
    </AuthLayout>
  )
}
