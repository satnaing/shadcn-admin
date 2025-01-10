import { createFileRoute } from '@tanstack/react-router'
import SignIn from '@/features/auth/sign-in'
import { guestMiddleware } from '@/lib/auth'

export const Route = createFileRoute('/(auth)/sign-in')({
  beforeLoad: () => {
    guestMiddleware()
  },
  component: SignIn,
})
