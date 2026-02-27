import { createLazyFileRoute } from '@tanstack/react-router'
import { MembershipPage } from '@/features/growth/loyalty/membership-page'

export const Route = createLazyFileRoute('/_authenticated/growth/membership')({
  component: MembershipPage,
})
