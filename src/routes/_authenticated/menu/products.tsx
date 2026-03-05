import { z } from 'zod'
import { createFileRoute } from '@tanstack/react-router'

const productSearchSchema = z.object({
  page: z.number().catch(1),
  limit: z.number().catch(10),
  search: z.string().optional(),
})

export const Route = createFileRoute('/_authenticated/menu/products')({
  validateSearch: productSearchSchema,
})
