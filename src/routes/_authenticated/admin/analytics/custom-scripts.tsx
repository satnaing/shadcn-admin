import { createFileRoute } from '@tanstack/react-router'
import { CustomScriptsPage } from '@/features/analytics/custom-scripts'

export const Route = createFileRoute(
  '/_authenticated/admin/analytics/custom-scripts'
)({
  component: CustomScriptsPage,
})
