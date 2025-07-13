import { createFileRoute } from '@tanstack/react-router'
import SettingsAccount from '@/features/settings/post'

export const Route = createFileRoute('/_authenticated/settings/post')({
  component: SettingsAccount,
})
