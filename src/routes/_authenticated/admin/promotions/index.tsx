import { createFileRoute } from '@tanstack/react-router'
import { PromotionsDashboard } from '@/features/promotions'

export const Route = createFileRoute('/_authenticated/admin/promotions/')({
  component: PromotionsDashboard,
})
