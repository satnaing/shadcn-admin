import { createFileRoute } from '@tanstack/react-router'
import { EmailTemplatesPage } from '@/features/marketing/email-templates'

export const Route = createFileRoute(
  '/_authenticated/admin/marketing/email-templates'
)({
  component: EmailTemplatesPage,
})
