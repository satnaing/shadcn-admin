import { createFileRoute } from '@tanstack/react-router'
import { WholesaleInHouse } from '@/features/products/wholesale/wholesale-in-house'

export const Route = createFileRoute(
  '/_authenticated/admin/wholesale-products/in-house'
)({
  component: WholesaleInHouse,
})
