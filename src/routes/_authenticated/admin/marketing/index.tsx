import { createFileRoute } from '@tanstack/react-router'
import { MarketingDashboard } from '@/features/marketing'

export const Route = createFileRoute('/_authenticated/admin/marketing/')({
  component: MarketingDashboard,
})
