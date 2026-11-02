import { createFileRoute } from '@tanstack/react-router'
import { SaleAlertsPage } from '@/features/marketing/sale-alerts'

export const Route = createFileRoute('/_authenticated/admin/marketing/sale-alerts')({
  component: SaleAlertsPage,
})
