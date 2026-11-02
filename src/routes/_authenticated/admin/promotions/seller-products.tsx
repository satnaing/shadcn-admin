import { createFileRoute } from '@tanstack/react-router'
import { SellerPromotionalProducts } from '@/features/promotions/seller-promotional-products'

export const Route = createFileRoute(
  '/_authenticated/admin/promotions/seller-products'
)({
  component: SellerPromotionalProducts,
})
