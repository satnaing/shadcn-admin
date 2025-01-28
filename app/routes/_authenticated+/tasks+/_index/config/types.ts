import type { z } from 'zod'
import { FILTER_FIELD_LABELS, PAGINATION_PER_PAGE_ITEMS } from './constants'
import type {
  FilterSchema,
  PaginationSchema,
  QuerySchema,
  SortSchema,
} from './schema'

export const FILTER_FIELDS = Object.keys(
  FILTER_FIELD_LABELS,
) as (keyof typeof FILTER_FIELD_LABELS)[]
export const PAGINATION_PER_PAGE_DEFAULT = PAGINATION_PER_PAGE_ITEMS[0]

export type Queries = z.infer<typeof QuerySchema>
export type Filters = z.infer<typeof FilterSchema>
export type Sort = z.infer<typeof SortSchema>
export type Pagination = z.infer<typeof PaginationSchema>
