import { createFileRoute } from '@tanstack/react-router'
import { SignIn } from '@clerk/clerk-react'
import { Skeleton } from '@/components/ui/skeleton'

export const Route = createFileRoute('/clerk/(auth)/sign-in')({
  component: () => (
    <SignIn fallback={<Skeleton className='h-[30rem] w-[25rem]' />} />
  ),
})
