import { createFileRoute } from '@tanstack/react-router'
import { NotificationHistoryPage } from '@/features/marketing/notifications-history'

export const Route = createFileRoute(
  '/_authenticated/admin/marketing/notifications/history'
)({
  component: NotificationHistoryPage,
})
