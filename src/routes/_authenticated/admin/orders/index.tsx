import { createFileRoute } from '@tanstack/react-router'
import { OrdersList } from '@/features/orders'

export const Route = createFileRoute('/_authenticated/admin/orders/')({
  component: OrdersList,
})
