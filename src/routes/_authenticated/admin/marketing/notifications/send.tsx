import { createFileRoute } from '@tanstack/react-router'
import { NotificationSendPage } from '@/features/marketing/notifications-send'

export const Route = createFileRoute(
  '/_authenticated/admin/marketing/notifications/send'
)({
  component: NotificationSendPage,
})
