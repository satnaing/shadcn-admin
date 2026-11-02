import { createFileRoute } from '@tanstack/react-router'
import { OrdersInHouse } from '@/features/orders/orders-in-house'

export const Route = createFileRoute('/_authenticated/admin/orders/in-house')({
  component: OrdersInHouse,
})
