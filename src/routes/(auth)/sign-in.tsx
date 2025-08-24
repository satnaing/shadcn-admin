import { createFileRoute } from '@tanstack/react-router'
import { SignIn } from '@clerk/clerk-react'
import { Skeleton } from '@/components/ui/skeleton'
import { getRedirectUrl } from '@/lib/auth'
import z from 'zod'

const signInSearchSchema = z.object({
  redirect: z.string().optional(),
})

export const Route = createFileRoute('/(auth)/sign-in')({
  validateSearch: signInSearchSchema,
  component: SignInComponent,
})

function SignInComponent() {
  const { redirect } = Route.useSearch()
  const redirectUrl = getRedirectUrl({ redirect })
  
  return (
    <SignIn
      fallback={<Skeleton className='h-[30rem] w-[25rem]' />}
      forceRedirectUrl={redirectUrl}
    />
  )
}
