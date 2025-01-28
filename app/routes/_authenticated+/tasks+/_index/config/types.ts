import type { z } from 'zod'
import type {
  FilterSchema,
  PaginationSchema,
  QuerySchema,
  SortSchema,
} from './schema'

export type Queries = z.infer<typeof QuerySchema>
export type Filters = z.infer<typeof FilterSchema>
export type Sort = z.infer<typeof SortSchema>
export type Pagination = z.infer<typeof PaginationSchema>
