import { createFileRoute } from '@tanstack/react-router'
import { NewslettersPage } from '@/features/marketing/newsletters'

export const Route = createFileRoute(
  '/_authenticated/admin/marketing/newsletters'
)({
  component: NewslettersPage,
})
