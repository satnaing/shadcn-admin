import { createFileRoute } from '@tanstack/react-router'
import { GoogleReportsPage } from '@/features/analytics/google-reports'

export const Route = createFileRoute(
  '/_authenticated/admin/analytics/google-reports'
)({
  component: GoogleReportsPage,
})
