import { z } from 'zod'

export const statusSearchSchema = z.coerce.string().optional()

export const listPaginationSearchFields = {
  page: z.coerce.number().optional().catch(1),
  pageSize: z.coerce.number().optional().catch(10),
  q: z.string().optional().catch(undefined),
  sort: z.string().optional().catch('id'),
  order: z.string().optional().catch('desc'),
  status: statusSearchSchema,
} as const

// generic so route files get typed extra keys (e.g. Route.useSearch().campaign_id)
export function createListSearchSchema<T extends z.ZodRawShape = Record<never, never>>(extra?: T) {
  return z.object({
    ...listPaginationSearchFields,
    ...(extra as T),
  })
}
