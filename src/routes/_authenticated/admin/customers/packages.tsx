import { createFileRoute } from '@tanstack/react-router'
import { CustomerPackagesList } from '@/features/customers/customer-packages'

export const Route = createFileRoute(
  '/_authenticated/admin/customers/packages'
)({
  component: CustomerPackagesList,
})
