import { createFileRoute } from '@tanstack/react-router'
import { SellerCommissions } from '@/features/sellers/seller-commissions'

export const Route = createFileRoute(
  '/_authenticated/admin/sellers/commissions'
)({
  component: SellerCommissions,
})
