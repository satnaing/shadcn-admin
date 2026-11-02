import { createFileRoute } from '@tanstack/react-router'
import { WholesaleSeller } from '@/features/products/wholesale/wholesale-seller'

export const Route = createFileRoute(
  '/_authenticated/admin/wholesale-products/seller'
)({
  component: WholesaleSeller,
})
