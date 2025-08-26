import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { SignUp } from '@clerk/clerk-react'
import { getRedirectUrl } from '@/lib/auth'
import { Skeleton } from '@/components/ui/skeleton'

const signUpSearchSchema = z.object({
  redirect: z.string().optional(),
})

export const Route = createFileRoute('/(auth)/sign-up')({
  validateSearch: signUpSearchSchema,
  component: SignUpComponent,
})

function SignUpComponent() {
  const { redirect } = Route.useSearch()
  const redirectUrl = getRedirectUrl({ redirect })

  return (
    <SignUp
      fallback={<Skeleton className='h-[30rem] w-[25rem]' />}
      forceRedirectUrl={redirectUrl}
    />
  )
}
