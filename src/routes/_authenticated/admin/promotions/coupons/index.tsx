import { createFileRoute } from '@tanstack/react-router'
import { Coupons } from '@/features/promotions/coupons'

export const Route = createFileRoute(
  '/_authenticated/admin/promotions/coupons/'
)({
  component: Coupons,
})
