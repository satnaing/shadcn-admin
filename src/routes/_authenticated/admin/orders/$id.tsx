import { createFileRoute } from '@tanstack/react-router'
import { OrderDetail } from '@/features/orders/order-detail'

export const Route = createFileRoute('/_authenticated/admin/orders/$id')({
  component: OrderDetail,
})
