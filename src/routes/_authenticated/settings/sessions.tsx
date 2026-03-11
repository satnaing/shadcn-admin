import { createFileRoute } from '@tanstack/react-router'
import { SettingsSessions } from '@/features/settings/sessions'

export const Route = createFileRoute('/_authenticated/settings/sessions')({
  component: SettingsSessions,
})
