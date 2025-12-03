import { createFileRoute } from '@tanstack/react-router'
import { LockScreen } from '@/features/auth/lock-screen'

export const Route = createFileRoute('/(auth)/lock-screen')({
  component: LockScreen,
})
