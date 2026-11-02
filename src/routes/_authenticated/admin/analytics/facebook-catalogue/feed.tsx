import { createFileRoute } from '@tanstack/react-router'
import { FacebookFeedPage } from '@/features/analytics/facebook-feed'

export const Route = createFileRoute(
  '/_authenticated/admin/analytics/facebook-catalogue/feed'
)({
  component: FacebookFeedPage,
})
