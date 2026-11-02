import { createFileRoute } from '@tanstack/react-router'
import { GtmPage } from '@/features/analytics/gtm'

export const Route = createFileRoute('/_authenticated/admin/analytics/gtm')({
  component: GtmPage,
})
