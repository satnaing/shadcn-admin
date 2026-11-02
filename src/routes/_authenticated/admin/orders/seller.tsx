import { createFileRoute } from '@tanstack/react-router'
import { OrdersSeller } from '@/features/orders/orders-seller'

export const Route = createFileRoute('/_authenticated/admin/orders/seller')({
  component: OrdersSeller,
})
