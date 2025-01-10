import { createLazyFileRoute } from '@tanstack/react-router'
import Users from '@/features/users'

export const Route = createLazyFileRoute('/_authenticated/referrals/')({
  component: Users,
})
