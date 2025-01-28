import { z } from 'zod'
import {
  FILTER_FIELDS,
  PAGINATION_PER_PAGE_DEFAULT,
  PAGINATION_PER_PAGE_ITEMS,
} from '../config'

// Define the types for queries, filters, pagination, and sorting
export const QuerySchema = z.object({
  title: z.preprocess(
    (val) => (val === null ? undefined : val),
    z.string().optional().default(''),
  ),
})

export const FilterSchema = z.object(
  FILTER_FIELDS.reduce(
    (acc, field) => {
      acc[field] = z.array(z.string()).optional().default([])
      return acc
    },
    {} as Record<
      (typeof FILTER_FIELDS)[number],
      z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString, 'many'>>>
    >,
  ),
)

export const SortSchema = z.object({
  sort_by: z.preprocess(
    (val) => (val === null ? undefined : val),
    z.string().optional(),
  ),
  sort_order: z.preprocess(
    (val) => (val === null ? undefined : val),
    z
      .union([z.literal('asc'), z.literal('desc')])
      .optional()
      .default('asc'),
  ),
})

export const PaginationSchema = z.object({
  page: z.preprocess(
    (val) => (val === null ? undefined : val),
    z.string().optional().default('1').transform(Number),
  ),
  per_page: z.preprocess(
    (val) => (val === null ? undefined : val),
    z
      .enum(PAGINATION_PER_PAGE_ITEMS)
      .optional()
      .default(PAGINATION_PER_PAGE_DEFAULT)
      .transform(Number),
  ),
})

export const parseSearchParams = (request: Request) => {
  const searchParams = new URL(request.url).searchParams
  const { title } = QuerySchema.parse({
    title: searchParams.get('title'),
  })
  const filters = FilterSchema.parse({
    ...Object.fromEntries(
      FILTER_FIELDS.map((field) => [field, searchParams.getAll(field)]),
    ),
  })
  const { sort_by: sortBy, sort_order: sortOrder } = SortSchema.parse({
    sort_by: searchParams.get('sort_by'),
    sort_order: searchParams.get('sort_order'),
  })

  const { page, per_page: perPage } = PaginationSchema.parse({
    page: searchParams.get('page'),
    per_page: searchParams.get('per_page'),
  })

  return { title, filters, sortBy, sortOrder, page, perPage }
}
