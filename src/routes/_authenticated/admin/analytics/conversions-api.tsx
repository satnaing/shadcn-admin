import { createFileRoute } from '@tanstack/react-router'
import { ConversionsApiPage } from '@/features/analytics/conversions-api'

export const Route = createFileRoute(
  '/_authenticated/admin/analytics/conversions-api'
)({
  component: ConversionsApiPage,
})
