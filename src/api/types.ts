/**
 * Laravel (AEC) API cavab formatları.
 * Mövcud `@/shared/types` strukturları təkrar yazılmır — yalnız API adları ilə ixrac olunur.
 */
export type {
  WithData as ApiResponse,
  WithPagination as ApiPaginatedResponse,
  MetaInterface as ApiMeta,
} from '@/shared/types'

/** Laravel validasiya / xəta cavabı (`422`, `403`, `500`). */
export interface ApiErrorResponse {
  message: string
  errors?: Record<string, string[]>
}

/** `{ message: 'ok' }` tipli sadə mutation cavabı. */
export interface ApiMessageResponse {
  message: string
}

/** Siyahı sorğularının ümumi query parametrləri. */
export interface ApiListParams {
  page?: number
  per_page?: number
  search?: string
  sort?: string
  order?: 'asc' | 'desc'
  [key: string]: unknown
}

/** TanStack Table-ın gözlədiyi pagination forması (`pagination.adapter.ts` çıxışı). */
export interface TablePagination {
  pageIndex: number
  pageSize: number
  pageCount: number
  rowCount: number
}

/** 6 rol — `@/config/panels` ilə eyni dəyərlər. */
export type ApiRole =
  | 'admin'
  | 'staff'
  | 'seller'
  | 'seller_staff'
  | 'courier'
  | 'supervisor'
  | 'customer'
