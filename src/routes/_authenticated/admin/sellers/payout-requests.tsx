import { createFileRoute } from '@tanstack/react-router'
import { SellerPayoutRequests } from '@/features/sellers/seller-payout-requests'

export const Route = createFileRoute(
  '/_authenticated/admin/sellers/payout-requests'
)({
  component: SellerPayoutRequests,
})
