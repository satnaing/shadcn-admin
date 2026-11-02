import { createFileRoute } from '@tanstack/react-router'
import { CategoryDiscounts } from '@/features/promotions/category-discounts'

export const Route = createFileRoute(
  '/_authenticated/admin/promotions/category-discounts'
)({
  component: CategoryDiscounts,
})
