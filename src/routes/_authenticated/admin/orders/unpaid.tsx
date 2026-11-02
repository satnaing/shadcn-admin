import { createFileRoute } from '@tanstack/react-router'
import { OrdersUnpaid } from '@/features/orders/orders-unpaid'

export const Route = createFileRoute('/_authenticated/admin/orders/unpaid')({
  component: OrdersUnpaid,
})
