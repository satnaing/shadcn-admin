import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toServerListParams } from '@/shared/utils/list-query-string'
import type { NavigateFn } from '@/hooks/use-table-url-state'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { EntityDataTable } from '@/components/data-table'
import type { PosProductItem } from '../data/pos.type'
import { usePosLookups, usePosProducts } from '../hooks/use-pos'
import { usePosMutations } from '../hooks/use-pos-mutations'
import { PosProductsBulkActions } from './pos-products-bulk-actions'
import { usePosProductColumns } from './pos-products-columns'

interface Pending {
  ids: number[]
  name?: string
  done?: () => void
}

interface Props {
  search: Record<string, unknown>
  navigate: NavigateFn
}

/** Products on the terminal: server-side search/sort/filter, remove from POS with a confirmation (row and bulk). */
export function PosProductsTable({ search, navigate }: Props) {
  const { t } = useTranslation('pos')
  const [removing, setRemoving] = useState<Pending | null>(null)
  const { setInPos } = usePosMutations()
  const lookups = usePosLookups().data?.data
  const { data } = usePosProducts(
    toServerListParams(search, { filters: ['category', 'seller'], defaultSort: 'id' })
  )
  const onRow = useCallback((p: PosProductItem) => setRemoving({ ids: [p.id], name: p.name }), [])
  const columns = usePosProductColumns(onRow)
  const toolbarFilters = useMemo(
    () => [
      {
        columnId: 'categoryFilter',
        title: t('products.columns.category'),
        mode: 'single' as const,
        options: (lookups?.categories ?? []).map((c) => ({
          label: `${'— '.repeat(c.depth)}${c.name}`,
          value: String(c.id),
        })),
      },
      {
        columnId: 'sellerFilter',
        title: t('products.columns.seller'),
        mode: 'single' as const,
        options: [
          { label: t('products.inhouse'), value: 'inhouse' },
          ...(lookups?.sellers ?? []).map((s) => ({ label: s.name, value: String(s.id) })),
        ],
      },
    ],
    [t, lookups]
  )
  const BulkActions = useCallback(
    ({ table }: { table: Parameters<typeof PosProductsBulkActions>[0]['table'] }) => (
      <PosProductsBulkActions
        table={table}
        onRemove={(ids, done) => setRemoving({ ids, done })}
      />
    ),
    []
  )

  return (
    <>
      <EntityDataTable
        data={data?.data ?? []}
        meta={data?.meta}
        search={search}
        navigate={navigate}
        columns={columns}
        searchPlaceholder={t('products.search')}
        noResultsMessage={t('products.empty')}
        enableStatusFilter={false}
        defaultSort='id'
        toolbarFilters={toolbarFilters}
        urlColumnFilters={[
          { columnId: 'categoryFilter', searchKey: 'category', type: 'string' },
          { columnId: 'sellerFilter', searchKey: 'seller', type: 'string' },
        ]}
        defaultColumnVisibility={{ categoryFilter: false, sellerFilter: false }}
        BulkActions={BulkActions}
      />
      <ConfirmDialog
        open={!!removing}
        onOpenChange={(open) => !open && setRemoving(null)}
        title={t('products.removeTitle')}
        desc={
          removing?.name
            ? t('products.removeOne', { name: removing.name })
            : t('products.removeMany', { count: removing?.ids.length ?? 0 })
        }
        confirmText={t('products.remove')}
        destructive
        isLoading={setInPos.isPending}
        handleConfirm={() =>
          removing &&
          setInPos.mutate(
            { ids: removing.ids, pos: false },
            {
              onSuccess: removing.done,
              onSettled: () => setRemoving(null),
            }
          )
        }
      />
    </>
  )
}
