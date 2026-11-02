import { createFileRoute } from '@tanstack/react-router'
import { CustomersList } from '@/features/customers'

export const Route = createFileRoute('/_authenticated/admin/customers/')({
  component: CustomersList,
})
