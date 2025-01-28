import type { z } from 'zod'
import type {
  FilterSchema,
  PaginationSchema,
  SearchSchema,
  SortSchema,
} from './schema'

export type Search = z.infer<typeof SearchSchema>
export type Filters = z.infer<typeof FilterSchema>
export type Sort = z.infer<typeof SortSchema>
export type Pagination = z.infer<typeof PaginationSchema>
