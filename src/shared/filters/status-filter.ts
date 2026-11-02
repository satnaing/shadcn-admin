import { LIMIT } from '@/shared/constant'

export const STATUS_FILTER_COLUMN_ID = 'status_label'
export const STATUS_FILTER_SEARCH_KEY = 'status'

export function normalizeStatusFilter(value: unknown): string | undefined {
  if (value === undefined || value === null || value === '') {
    return undefined
  }

  if (Array.isArray(value)) {
    const first = value[0]
    return first !== undefined && first !== null && String(first) !== ''
      ? String(first)
      : undefined
  }

  return String(value)
}

export function useListSearchParams(search: Record<string, unknown>) {
  return {
    page: typeof search.page === 'number' ? search.page : 1,
    pageSize: typeof search.pageSize === 'number' ? search.pageSize : LIMIT,
    sort: typeof search.sort === 'string' ? search.sort : 'id',
    order: typeof search.order === 'string' ? search.order : 'desc',
    status: normalizeStatusFilter(search.status),
    page_key:
      typeof search.page_key === 'string' && search.page_key !== ''
        ? search.page_key
        : undefined,
  }
}

export function getStatusColumnFilterConfig() {
  return {
    columnId: STATUS_FILTER_COLUMN_ID,
    searchKey: STATUS_FILTER_SEARCH_KEY,
    type: 'string' as const,
  }
}

export function getStatusToolbarFilter(t: (key: string) => string) {
  return {
    columnId: STATUS_FILTER_COLUMN_ID,
    title: t('filters.status'),
    mode: 'single' as const,
    options: [
      { label: t('status.enabled'), value: '1' },
      { label: t('status.disabled'), value: '0' },
    ],
  }
}
