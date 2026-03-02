import { z } from 'zod'
import { createFileRoute } from '@tanstack/react-router'

const searchSchema = z.object({
  page: z.number().catch(1),
  limit: z.number().catch(10),
  search: z.string().optional(),
})

export const Route = createFileRoute('/_authenticated/growth/customers')({
  validateSearch: searchSchema,
})
