import { createFileRoute } from '@tanstack/react-router'
import { SellersPending } from '@/features/sellers/sellers-pending'

export const Route = createFileRoute('/_authenticated/admin/sellers/pending')({
  component: SellersPending,
})
