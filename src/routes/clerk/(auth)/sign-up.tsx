import { createFileRoute } from '@tanstack/react-router'
import { SignUp } from '@clerk/react'
import { Skeleton } from '@/components/ui/skeleton'

export const Route = createFileRoute('/clerk/(auth)/sign-up')({
  component: () => <SignUp fallback={<Skeleton className='h-120 w-100' />} />,
})
