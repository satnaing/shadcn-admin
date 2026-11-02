import { createFileRoute } from '@tanstack/react-router'
import { SellersList } from '@/features/sellers'

export const Route = createFileRoute('/_authenticated/admin/sellers/')({
  component: SellersList,
})
