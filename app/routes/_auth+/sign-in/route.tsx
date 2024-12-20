import { parseWithZod } from '@conform-to/zod'
import { setTimeout } from 'node:timers/promises'
import { redirectWithSuccess } from 'remix-toast'
import { Card } from '~/components/ui/card'
import type { Route } from './+types/route'
import { UserAuthForm } from './components/user-auth-form'
import { formSchema } from './schema'

export const action = async ({ request }: Route.ActionArgs) => {
  const submission = parseWithZod(await request.formData(), {
    schema: formSchema,
  })

  if (submission.status !== 'success') {
    return { lastResult: submission.reply() }
  }

  if (submission.value.email !== 'name@example.com') {
    return {
      lastResult: submission.reply({
        formErrors: ['Invalid email or password'],
      }),
    }
  }
  await setTimeout(3000)

  throw await redirectWithSuccess('/', {
    message: 'You have successfully logged in!',
  })
}

export default function SignIn() {
  return (
    <Card className="p-6">
      <div className="flex flex-col space-y-2 text-left">
        <h1 className="text-2xl font-semibold tracking-tight">Login</h1>
        <p className="text-sm text-muted-foreground">
          Enter your email and password below <br />
          to log into your account
        </p>
      </div>
      <UserAuthForm />
      <p className="mt-4 px-8 text-center text-sm text-muted-foreground">
        By clicking login, you agree to our{' '}
        <a
          href="/terms"
          className="underline underline-offset-4 hover:text-primary"
        >
          Terms of Service
        </a>{' '}
        and{' '}
        <a
          href="/privacy"
          className="underline underline-offset-4 hover:text-primary"
        >
          Privacy Policy
        </a>
        .
      </p>
    </Card>
  )
}
