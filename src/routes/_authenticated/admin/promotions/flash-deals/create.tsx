import { createFileRoute } from '@tanstack/react-router'
import { FlashDealCreate } from '@/features/promotions/flash-deal-create'

export const Route = createFileRoute(
  '/_authenticated/admin/promotions/flash-deals/create'
)({
  component: FlashDealCreate,
})
