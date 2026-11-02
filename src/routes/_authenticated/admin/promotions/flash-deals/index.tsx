import { createFileRoute } from '@tanstack/react-router'
import { FlashDeals } from '@/features/promotions/flash-deals'

export const Route = createFileRoute(
  '/_authenticated/admin/promotions/flash-deals/'
)({
  component: FlashDeals,
})
