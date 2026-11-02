import { createFileRoute } from '@tanstack/react-router'
import { WholesaleCreate } from '@/features/products/wholesale/wholesale-create'

export const Route = createFileRoute(
  '/_authenticated/admin/wholesale-products/create'
)({
  component: WholesaleCreate,
})
