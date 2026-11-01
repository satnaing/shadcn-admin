import { useMemo, useState } from 'react'
import type { VisibilityState } from '@tanstack/react-table'
import { LIMIT } from '@/shared/constant'
import {
  getStatusColumnFilterConfig,
  STATUS_FILTER_COLUMN_ID,
} from '@/shared/filters/status-filter'
import type { MetaInterface } from '@/shared/types'
import { useTranslation } from 'react-i18next'
import { type NavigateFn, useTableUrlState } from '@/hooks/use-table-url-state'
import { EMPTY_PAGE_COUNT } from '../constants'
import type { ToolbarFilter } from '../types'
import { resolveToolbarFilters } from '../utils'

interface UseEntityTableUrlStateParams {
  meta?: MetaInterface
  search: Record<string, unknown>
  navigate: NavigateFn
  enableStatusFilter: boolean
  defaultSort: string
  defaultOrder: 'asc' | 'desc'
  toolbarFilters?: ToolbarFilter[]
  urlColumnFilters?: Array<{
    columnId: string
    searchKey: string
    type?: 'string' | 'array'
  }>
  defaultColumnVisibility?: VisibilityState
}

export function useEntityTableUrlState({
  meta,
  search,
  navigate,
  enableStatusFilter,
  defaultSort,
  defaultOrder,
  toolbarFilters,
  urlColumnFilters,
  defaultColumnVisibility,
}: UseEntityTableUrlStateParams) {
  const { t } = useTranslation('common')
  const [rowSelection, setRowSelection] = useState({})
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    ...(enableStatusFilter ? { [STATUS_FILTER_COLUMN_ID]: false } : {}),
    ...defaultColumnVisibility,
  })

  const resolvedToolbarFilters = useMemo(
    () => resolveToolbarFilters(toolbarFilters, enableStatusFilter, t),
    [enableStatusFilter, t, toolbarFilters]
  )

  const columnFilterConfigs = useMemo(
    () => [
      ...(enableStatusFilter ? [getStatusColumnFilterConfig()] : []),
      ...(urlColumnFilters ?? []),
    ],
    [enableStatusFilter, urlColumnFilters]
  )

  const urlState = useTableUrlState({
    search,
    navigate,
    pagination: { defaultPage: 1, defaultPageSize: LIMIT },
    sorting: { defaultSort, defaultOrder },
    globalFilter: { enabled: false },
    columnFilters: columnFilterConfigs,
  })

  const pageCount = meta?.last_page ?? EMPTY_PAGE_COUNT
  const rowCount = meta?.total ?? 0

  return {
    ...urlState,
    rowSelection,
    setRowSelection,
    columnVisibility,
    setColumnVisibility,
    resolvedToolbarFilters,
    pageCount,
    rowCount,
    pageIndex: urlState.pagination.pageIndex,
    pageSize: urlState.pagination.pageSize,
  }
}
