import { createFileRoute } from '@tanstack/react-router'
import { GoogleAnalyticsPage } from '@/features/analytics/google-analytics'

export const Route = createFileRoute('/_authenticated/admin/analytics/google')({
  component: GoogleAnalyticsPage,
})
