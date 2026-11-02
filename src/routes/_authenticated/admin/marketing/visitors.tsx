import { createFileRoute } from '@tanstack/react-router'
import { VisitorsPage } from '@/features/marketing/visitors'

export const Route = createFileRoute(
  '/_authenticated/admin/marketing/visitors'
)({
  component: VisitorsPage,
})
