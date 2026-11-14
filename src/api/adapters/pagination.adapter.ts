import type { ApiMeta, ApiPaginatedResponse, TablePagination } from '@/api/types'
import { toNumber } from '@/api/adapters/cast'

/** Laravel `meta` → TanStack Table pagination. */
export function toTablePagination(meta?: Partial<ApiMeta> | null): TablePagination {
  const perPage = Math.max(toNumber(meta?.per_page, 10), 1)
  return {
    pageIndex: Math.max(toNumber(meta?.current_page, 1) - 1, 0),
    pageSize: perPage,
    pageCount: Math.max(toNumber(meta?.last_page, 1), 1),
    rowCount: toNumber(meta?.total, 0),
  }
}

/** TanStack Table state → Laravel query parametrləri. */
export function toPageParams(pagination: {
  pageIndex: number
  pageSize: number
}): { page: number; per_page: number } {
  return {
    page: pagination.pageIndex + 1,
    per_page: pagination.pageSize,
  }
}

/** Səhifələnmiş cavabı cədvəlin gözlədiyi `{ rows, pagination }` formasına açır. */
export function unwrapPaginated<T>(
  response: ApiPaginatedResponse<T[]>
): { rows: T[]; pagination: TablePagination } {
  return {
    rows: Array.isArray(response?.data) ? response.data : [],
    pagination: toTablePagination(response?.meta),
  }
}
