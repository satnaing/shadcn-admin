import { createFileRoute } from '@tanstack/react-router'
import { GlobalSeoPage } from '@/features/analytics/global-seo'

export const Route = createFileRoute(
  '/_authenticated/admin/analytics/seo'
)({
  component: GlobalSeoPage,
})
