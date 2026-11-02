import { createFileRoute } from '@tanstack/react-router'
import { CustomersUnverified } from '@/features/customers/customers-unverified'

export const Route = createFileRoute(
  '/_authenticated/admin/customers/unverified'
)({
  component: CustomersUnverified,
})
