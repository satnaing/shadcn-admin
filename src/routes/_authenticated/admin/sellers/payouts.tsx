import { createFileRoute } from '@tanstack/react-router'
import { SellerPayouts } from '@/features/sellers/seller-payouts'

export const Route = createFileRoute('/_authenticated/admin/sellers/payouts')({
  component: SellerPayouts,
})
