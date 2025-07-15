import { createLazyFileRoute } from '@tanstack/react-router'
import Otp from '@/features/auth/otp'

export const Route = createLazyFileRoute('/(auth)/otp')({
  component: Otp,
})
