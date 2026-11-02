import { createFileRoute } from '@tanstack/react-router'
import { AlertsPage } from '@/features/marketing/alerts'

export const Route = createFileRoute('/_authenticated/admin/marketing/alerts')({
  component: AlertsPage,
})
