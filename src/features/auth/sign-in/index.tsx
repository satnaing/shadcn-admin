import { Card } from '@/components/ui/card'
import AuthLayout from '../auth-layout'
import { UserAuthForm } from './components/user-auth-form'

export default function SignIn() {
  return (
    <AuthLayout>
      <Card className='p-6'>
        <div className='flex flex-col space-y-2 text-left'>
          <h1 className='text-2xl font-semibold tracking-tight'>로그인</h1>
          <p className='text-sm text-muted-foreground'>
            계정에 로그인하려면 아래에 로그인 버튼을 클릭하세요.
          </p>
        </div>
        <UserAuthForm />
        <p className='mt-4 px-8 text-center text-sm text-muted-foreground'>
          로그인 버튼을 클릭하면{' '}
          <a
            href='/terms'
            className='underline underline-offset-4 hover:text-primary'
          >
            서비스 약관
          </a>{' '}
          및{' '}
          <a
            href='/privacy'
            className='underline underline-offset-4 hover:text-primary'
          >
            개인정보 처리방침
          </a>
          에 동의하게 됩니다.
        </p>
      </Card>
    </AuthLayout>
  )
}
