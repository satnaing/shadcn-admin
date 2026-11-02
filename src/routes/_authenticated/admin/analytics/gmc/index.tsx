import { createFileRoute } from '@tanstack/react-router'
import { GmcConfigPage } from '@/features/analytics/gmc-config'

export const Route = createFileRoute('/_authenticated/admin/analytics/gmc/')({
  component: GmcConfigPage,
})
