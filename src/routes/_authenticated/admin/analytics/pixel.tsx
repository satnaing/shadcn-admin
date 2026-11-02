import { createFileRoute } from '@tanstack/react-router'
import { MetaPixelPage } from '@/features/analytics/pixel'

export const Route = createFileRoute('/_authenticated/admin/analytics/pixel')({
  component: MetaPixelPage,
})
