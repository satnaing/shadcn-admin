import { createFileRoute } from '@tanstack/react-router'
import { PromotionalProducts } from '@/features/promotions/promotional-products'

export const Route = createFileRoute('/_authenticated/admin/promotions/products')({
  component: PromotionalProducts,
})
