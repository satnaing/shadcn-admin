import { parseWithZod } from '@conform-to/zod'
import { setTimeout } from 'node:timers/promises'
import { Link } from 'react-router'
import { dataWithSuccess } from 'remix-toast'
import { z } from 'zod'
import { Card } from '~/components/ui/card'
import type { Route } from './+types/route'
import { ForgotForm } from './components/forgot-password-form'

export const formSchema = z.object({
  email: z
    .string({ required_error: 'Please enter your email' })
    .email({ message: 'Invalid email address' }),
})

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
        formErrors: ['Email not found in our records. Please try again.'],
      }),
    }
  }
  await setTimeout(1000)
  return dataWithSuccess(
    { lastResult: submission.reply({ resetForm: true }) },
    {
      message: 'Password reset link sent to your email',
    },
  )
}

export default function ForgotPassword() {
  return (
    <Card className="p-6">
      <div className="mb-2 flex flex-col space-y-2 text-left">
        <h1 className="text-md font-semibold tracking-tight">
          Forgot Password
        </h1>
        <p className="text-muted-foreground text-sm">
          Enter your registered email and <br /> we will send you a link to
          reset your password.
        </p>
      </div>
      <ForgotForm />
      <p className="text-muted-foreground mt-4 px-8 text-center text-sm">
        Don't have an account?{' '}
        <Link
          to="/sign-up"
          className="hover:text-primary underline underline-offset-4"
        >
          Sign up
        </Link>
        .
      </p>
    </Card>
  )
}
