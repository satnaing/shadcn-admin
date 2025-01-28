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

export const SearchParamsQuery = QuerySchema.merge(FilterSchema)
  .merge(SortSchema)
  .merge(PaginationSchema)
