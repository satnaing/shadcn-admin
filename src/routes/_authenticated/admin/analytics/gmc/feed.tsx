import { createFileRoute } from '@tanstack/react-router'
import { GmcFeedPage } from '@/features/analytics/gmc-feed'

export const Route = createFileRoute('/_authenticated/admin/analytics/gmc/feed')({
  component: GmcFeedPage,
})
