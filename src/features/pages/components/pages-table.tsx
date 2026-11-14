import { useMemo } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { EntityDataTable, type ToolbarFilter } from '@/components/data-table'
import type { NavigateFn } from '@/hooks/use-table-url-state'
import { FALLBACK_FORM_LOCALES } from '@/shared/constants/locales'
import type { MetaInterface } from '@/shared/types'
import type { PageRow } from '../data/pages.type'
import { createPageColumns, LANG_FILTER_ID, STATUS_FILTER_ID } from './pages-columns'
import type { PageRowHandlers } from './page-row-actions'

const URL_FILTERS = [
  { columnId: STATUS_FILTER_ID, searchKey: 'status', type: 'string' as const },
  { columnId: LANG_FILTER_ID, searchKey: 'lang', type: 'string' as const },
]
const HIDDEN = { [STATUS_FILTER_ID]: false, [LANG_FILTER_ID]: false }

interface PagesTableProps {
  rows: PageRow[]
  meta?: MetaInterface
  search: Record<string, unknown>
  navigate: NavigateFn
  handlers: Omit<PageRowHandlers, 'onBuilder'>
}

export function PagesTable({ rows, meta, search, navigate, handlers }: PagesTableProps) {
  const { t } = useTranslation('pages')
  const goTo = useNavigate()

  const columns = useMemo(
    () =>
      createPageColumns(t, {
        ...handlers,
        onBuilder: (page) => void goTo({ to: '/admin/pages/$id/builder', params: { id: String(page.id) } }),
      }),
    [t, handlers, goTo]
  )

  const filters = useMemo<ToolbarFilter[]>(
    () => [
      {
        columnId: STATUS_FILTER_ID,
        title: t('columns.status'),
        mode: 'single',
        options: [
          { label: t('status.draft'), value: 'draft' },
          { label: t('status.published'), value: 'published' },
        ],
      },
      {
        columnId: LANG_FILTER_ID,
        title: t('columns.languages'),
        mode: 'single',
        options: FALLBACK_FORM_LOCALES.map((code) => ({ label: code.toUpperCase(), value: code })),
      },
    ],
    [t]
  )

  return (
    <EntityDataTable
      data={rows}
      meta={meta}
      search={search}
      navigate={navigate}
      columns={columns}
      searchPlaceholder={t('list.search')}
      noResultsMessage={t('list.empty')}
      enableRowSelection={false}
      enableStatusFilter={false}
      defaultSort='updated_at'
      toolbarFilters={filters}
      urlColumnFilters={URL_FILTERS}
      defaultColumnVisibility={HIDDEN}
    />
  )
}
