import { parseWithZod } from '@conform-to/zod/v4'
import { setTimeout } from 'node:timers/promises'
import { Link } from 'react-router'
import { redirectWithSuccess } from 'remix-toast'
import { z } from 'zod'
import { Card } from '~/components/ui/card'
import type { Route } from './+types/route'
import { OtpForm } from './components/otp-form'

export const formSchema = z.object({
  otp: z.string({ required_error: 'Please enter your otp code.' }),
})

export const action = async ({ request }: Route.ActionArgs) => {
  const submission = parseWithZod(await request.formData(), {
    schema: formSchema,
  })
  if (submission.status !== 'success') {
    return { lastResult: submission.reply() }
  }

  if (submission.value.otp !== '123456') {
    return {
      lastResult: submission.reply({ formErrors: ['Invalid OTP code'] }),
    }
  }
  await setTimeout(1000)

  throw await redirectWithSuccess('/', {
    message: 'You have successfully logged in!',
  })
}

export default function Otp() {
  return (
    <Card className="p-6">
      <div className="mb-2 flex flex-col space-y-2 text-left">
        <h1 className="text-md font-semibold tracking-tight">
          Two-factor Authentication
        </h1>
        <p className="text-muted-foreground text-sm">
          Please enter the authentication code. <br /> We have sent the
          authentication code to your email.
        </p>
      </div>
      <OtpForm />
      <p className="text-muted-foreground mt-4 px-8 text-center text-sm">
        Haven't received it?{' '}
        <Link
          to="/sign-in"
          className="hover:text-primary underline underline-offset-4"
        >
          Resend a new code.
        </Link>
        .
      </p>
    </Card>
  )
}
