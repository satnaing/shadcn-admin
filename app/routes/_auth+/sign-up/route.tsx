import { parseWithZod } from '@conform-to/zod'
import { setTimeout } from 'node:timers/promises'
import { Link } from 'react-router'
import { redirectWithSuccess } from 'remix-toast'
import { z } from 'zod'
import { Card } from '~/components/ui/card'
import type { Route } from './+types/route'
import { SignUpForm } from './components/sign-up-form'

export const formSchema = z
  .object({
    email: z
      .string()
      .min(1, { message: 'Please enter your email' })
      .email({ message: 'Invalid email address' }),
    password: z
      .string()
      .min(1, {
        message: 'Please enter your password',
      })
      .min(7, {
        message: 'Password must be at least 7 characters long',
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ['confirmPassword'],
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
        formErrors: ['Invalid email or password'],
      }),
    }
  }
  await setTimeout(1000)

  throw await redirectWithSuccess('/', {
    message: 'Account created successfully!',
  })
}

export default function SignUp() {
  return (
    <Card className="p-6">
      <div className="mb-2 flex flex-col space-y-2 text-left">
        <h1 className="text-lg font-semibold tracking-tight">
          Create an account
        </h1>
        <p className="text-muted-foreground text-sm">
          Enter your email and password to create an account. <br />
          Already have an account?{' '}
          <Link
            to="/sign-in"
            className="hover:text-primary underline underline-offset-4"
          >
            Sign In
          </Link>
        </p>
      </div>
      <SignUpForm />
      <p className="text-muted-foreground mt-4 px-8 text-center text-sm">
        By creating an account, you agree to our{' '}
        <a
          href="/terms"
          className="hover:text-primary underline underline-offset-4"
        >
          Terms of Service
        </a>{' '}
        and{' '}
        <a
          href="/privacy"
          className="hover:text-primary underline underline-offset-4"
        >
          Privacy Policy
        </a>
        .
      </p>
    </Card>
  )
}
