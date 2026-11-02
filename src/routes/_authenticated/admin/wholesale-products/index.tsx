import { createFileRoute } from '@tanstack/react-router'
import { WholesaleList } from '@/features/products/wholesale/wholesale-list'

export const Route = createFileRoute(
  '/_authenticated/admin/wholesale-products/'
)({
  component: WholesaleList,
})
