import { z } from 'zod'

export const statusSearchSchema = z.coerce.string().optional()

export const listPaginationSearchFields = {
  page: z.coerce.number().optional().catch(1),
  pageSize: z.coerce.number().optional().catch(10),
  sort: z.string().optional().catch('id'),
  order: z.string().optional().catch('desc'),
  status: statusSearchSchema,
} as const

export function createListSearchSchema(extra?: z.ZodRawShape) {
  return z.object({
    ...listPaginationSearchFields,
    ...extra,
  })
}
