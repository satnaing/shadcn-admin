import { createFileRoute } from '@tanstack/react-router'
import { SellerVerificationForm } from '@/features/sellers/seller-verification-form'

export const Route = createFileRoute(
  '/_authenticated/admin/sellers/verification-form'
)({
  component: SellerVerificationForm,
})
