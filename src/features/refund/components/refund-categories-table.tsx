import { useCallback, useMemo, useState } from 'react'
import type { Table } from '@tanstack/react-table'
import { CalendarDays } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { EntityDataTable } from '@/components/data-table'
import { DataTableBulkActions } from '@/components/data-table/bulk-actions'
import { Button } from '@/components/ui/button'
import type { NavigateFn } from '@/hooks/use-table-url-state'
import { toServerListParams } from '@/shared/utils/list-query-string'
import type { CategoryRefundItem } from '../data/refund.type'
import { useRefundCategories } from '../hooks/use-refund'
import { useRefundCategoryColumns } from './refund-categories-columns'
import { RefundDaysDialog } from './refund-days-dialog'

interface Props {
  search: Record<string, unknown>
  navigate: NavigateFn
}

export function RefundCategoriesTable({ search, navigate }: Props) {
  const { t } = useTranslation('refund')
  const [editing, setEditing] = useState<CategoryRefundItem | null>(null)
  const [bulk, setBulk] = useState<{ ids: number[]; reset: () => void } | null>(null)
  const columns = useRefundCategoryColumns(setEditing)
  const { data } = useRefundCategories(toServerListParams(search, { filters: ['main', 'unassigned'], defaultSort: 'name', defaultOrder: 'asc' }))

  const toolbarFilters = useMemo(
    () => [
      { columnId: 'main', title: t('categories.level'), mode: 'single' as const, options: [{ label: t('categories.mainOnly'), value: '1' }] },
      { columnId: 'unassigned', title: t('categories.columns.days'), mode: 'single' as const, options: [{ label: t('categories.unassigned'), value: '1' }] },
    ],
    [t]
  )

  const BulkActions = useCallback(
    ({ table }: { table: Table<CategoryRefundItem> }) => (
      <DataTableBulkActions table={table} entityName={t('categories.entity')}>
        <Button
          size='sm'
          variant='outline'
          onClick={() =>
            setBulk({ ids: table.getFilteredSelectedRowModel().rows.map((r) => r.original.id), reset: () => table.resetRowSelection() })
          }
        >
          <CalendarDays className='me-2 size-4' />
          {t('categories.assignDays')}
        </Button>
      </DataTableBulkActions>
    ),
    [t]
  )

  return (
    <>
      <EntityDataTable
        data={data?.data ?? []}
        meta={data?.meta}
        search={search}
        navigate={navigate}
        columns={columns}
        searchPlaceholder={t('categories.search')}
        noResultsMessage={t('categories.empty')}
        enableStatusFilter={false}
        defaultSort='name'
        defaultOrder='asc'
        toolbarFilters={toolbarFilters}
        urlColumnFilters={[
          { columnId: 'main', searchKey: 'main', type: 'string' },
          { columnId: 'unassigned', searchKey: 'unassigned', type: 'string' },
        ]}
        BulkActions={BulkActions}
      />
      {editing && (
        <RefundDaysDialog key={editing.id} open onOpenChange={(open) => !open && setEditing(null)} ids={[editing.id]} current={editing.refund_days} />
      )}
      {bulk && <RefundDaysDialog open onOpenChange={(open) => !open && setBulk(null)} ids={bulk.ids} onDone={bulk.reset} />}
    </>
  )
}
