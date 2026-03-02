import { z } from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import OrdersPage from '@/features/operations/orders/index'

const ordersSearchSchema = z.object({
  page: z.number().catch(1),
  limit: z.number().catch(10),
  search: z.string().optional(),
})

export const Route = createFileRoute('/_authenticated/operations/orders')({
  component: OrdersPage,
  validateSearch: ordersSearchSchema,
})
