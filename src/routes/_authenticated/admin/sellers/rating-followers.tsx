import { createFileRoute } from '@tanstack/react-router'
import { SellersRating } from '@/features/sellers/sellers-rating'

export const Route = createFileRoute(
  '/_authenticated/admin/sellers/rating-followers'
)({
  component: SellersRating,
})
