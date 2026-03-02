import { z } from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import Inventory from '@/features/inventory/stocks/index'

const inventorySearchSchema = z.object({
  page: z.number().catch(1),
  limit: z.number().catch(20),
})

export const Route = createFileRoute('/_authenticated/inventory/stock')({
  component: Inventory,
  validateSearch: inventorySearchSchema,
})
