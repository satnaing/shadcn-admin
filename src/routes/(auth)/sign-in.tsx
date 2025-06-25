import { z } from 'zod'
import { createFileRoute } from '@tanstack/react-router'
// <-- add this import
import SignIn from '@/features/auth/sign-in'

export const Route = createFileRoute('/(auth)/sign-in')({
  // Add this:
  validateSearch: z.object({
    redirect: z.string().optional(),
  }),
  component: SignIn,
})
