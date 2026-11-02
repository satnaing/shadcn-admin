import { createFileRoute } from '@tanstack/react-router'
import { SubscribersPage } from '@/features/marketing/subscribers'

export const Route = createFileRoute(
  '/_authenticated/admin/marketing/subscribers'
)({
  component: SubscribersPage,
})
