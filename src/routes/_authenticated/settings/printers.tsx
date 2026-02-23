import { createFileRoute } from '@tanstack/react-router'
import { SettingsPrinters } from '@/features/settings/printers'

export const Route = createFileRoute('/_authenticated/settings/printers')({
  component: SettingsPrinters,
})
