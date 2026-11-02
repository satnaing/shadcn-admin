import { createFileRoute } from '@tanstack/react-router'
import { SellerPackages } from '@/features/sellers/seller-packages'

export const Route = createFileRoute('/_authenticated/admin/sellers/packages')({
  component: SellerPackages,
})
