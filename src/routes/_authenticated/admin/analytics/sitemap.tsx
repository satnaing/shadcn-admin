import { createFileRoute } from '@tanstack/react-router'
import { SitemapPage } from '@/features/analytics/sitemap'

export const Route = createFileRoute(
  '/_authenticated/admin/analytics/sitemap'
)({
  component: SitemapPage,
})
