import { createFileRoute } from '@tanstack/react-router'
import { OrdersPickup } from '@/features/orders/orders-pickup'

export const Route = createFileRoute(
  '/_authenticated/admin/orders/pickup-point'
)({
  component: OrdersPickup,
})
