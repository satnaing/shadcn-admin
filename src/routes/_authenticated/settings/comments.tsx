import { createFileRoute } from '@tanstack/react-router'
import SettingsNotifications from '@/features/settings/comments'

export const Route = createFileRoute('/_authenticated/settings/comments')({
  component: SettingsNotifications,
})
