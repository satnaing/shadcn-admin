import { z } from 'zod/v4'
import {
  FILTER_FIELDS,
  PAGINATION_PER_PAGE_DEFAULT,
  PAGINATION_PER_PAGE_ITEMS,
  SEARCH_FIELD,
} from '../config'

// Define the schema for the search query
export const SearchSchema = z.object({
  [SEARCH_FIELD]: z.preprocess(
    (val) => (val === null ? undefined : val),
    z.string().optional().default(''),
  ),
})

// Define the schema for filters
export const FilterSchema = z.object(
  FILTER_FIELDS.reduce(
    (acc, field) => {
      acc[field] = z.array(z.string()).optional().default([])
      return acc
    },
    {} as Record<
      (typeof FILTER_FIELDS)[number],
      z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString>>>
    >,
  ),
)

// Define the schema for sorting
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

// Define the schema for pagination
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

// Parse query parameters from the request
export const parseQueryParams = (request: Request) => {
  const searchParams = new URL(request.url).searchParams
  const search = SearchSchema.parse({
    [SEARCH_FIELD]: searchParams.get(SEARCH_FIELD),
  })
  const filters = FilterSchema.parse(
    Object.fromEntries(
      FILTER_FIELDS.map((field) => [field, searchParams.getAll(field)]),
    ),
  )
  const { sort_by: sortBy, sort_order: sortOrder } = SortSchema.parse({
    sort_by: searchParams.get('sort_by'),
    sort_order: searchParams.get('sort_order'),
  })

  const { page, per_page: perPage } = PaginationSchema.parse({
    page: searchParams.get('page'),
    per_page: searchParams.get('per_page'),
  })

  return { search, filters, sortBy, sortOrder, page, perPage }
}
