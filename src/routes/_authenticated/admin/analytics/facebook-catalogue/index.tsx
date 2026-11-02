import { createFileRoute } from '@tanstack/react-router'
import { FacebookCataloguePage } from '@/features/analytics/facebook-catalogue'

export const Route = createFileRoute(
  '/_authenticated/admin/analytics/facebook-catalogue/'
)({
  component: FacebookCataloguePage,
})
