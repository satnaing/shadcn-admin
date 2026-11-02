import { createFileRoute } from '@tanstack/react-router'
import { NotificationTypesPage } from '@/features/marketing/notifications-types'

export const Route = createFileRoute(
  '/_authenticated/admin/marketing/notifications/types'
)({
  component: NotificationTypesPage,
})
