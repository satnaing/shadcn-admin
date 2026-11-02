import { createFileRoute } from '@tanstack/react-router'
import { AnalyticsDashboard } from '@/features/analytics'

export const Route = createFileRoute('/_authenticated/admin/analytics/')({
  component: AnalyticsDashboard,
})
