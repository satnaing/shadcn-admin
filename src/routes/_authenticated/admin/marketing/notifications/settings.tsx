import { createFileRoute } from '@tanstack/react-router'
import { NotificationSettingsPage } from '@/features/marketing/notifications-settings'

export const Route = createFileRoute(
  '/_authenticated/admin/marketing/notifications/settings'
)({
  component: NotificationSettingsPage,
})
