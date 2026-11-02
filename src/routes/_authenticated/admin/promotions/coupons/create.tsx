import { createFileRoute } from '@tanstack/react-router'
import { CouponCreate } from '@/features/promotions/coupon-create'

export const Route = createFileRoute(
  '/_authenticated/admin/promotions/coupons/create'
)({
  component: CouponCreate,
})
