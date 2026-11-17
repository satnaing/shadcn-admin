import { useCallback, useMemo, useState } from 'react'
import { toServerListParams } from '@/shared/utils/list-query-string'
import { useTranslation } from 'react-i18next'
import type { NavigateFn } from '@/hooks/use-table-url-state'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { EntityDataTable } from '@/components/data-table'
import type { ProductFlag, WholesaleProduct } from '../data/wholesale.type'
import {
  useWholesaleLookups,
  useWholesaleProducts,
} from '../hooks/use-wholesale'
import { useWholesaleMutations } from '../hooks/use-wholesale-mutations'
import { WholesaleProductsBulkActions } from './wholesale-products-bulk-actions'
import { useWholesaleProductColumns } from './wholesale-products-columns'

interface Props {
  owner: string
  search: Record<string, unknown>
  navigate: NavigateFn
}

export function WholesaleProductsTable({ owner, search, navigate }: Props) {
  const { t } = useTranslation('wholesale')
  const [removing, setRemoving] = useState<WholesaleProduct | null>(null)
  const { setFlag, removeProduct } = useWholesaleMutations()
  const onFlag = useCallback(
    (p: WholesaleProduct, flag: ProductFlag, value: boolean) =>
      setFlag.mutate({ id: p.id, flag, value }),
    [setFlag]
  )
  const columns = useWholesaleProductColumns(owner, onFlag, setRemoving)
  const { data } = useWholesaleProducts({
    ...toServerListParams(search, {
      defaultSort: 'created_at',
      filters: ['seller'],
    }),
    owner,
  })
  const { data: lookups } = useWholesaleLookups()
  const toolbarFilters = useMemo(
    () =>
      owner === 'inhouse'
        ? []
        : [
            {
              columnId: 'seller',
              title: t('products.seller'),
              mode: 'single' as const,
              options: (lookups?.data.sellers ?? []).map((s) => ({
                label: s.name,
                value: String(s.id),
              })),
            },
          ],
    [owner, lookups, t]
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
        defaultSort='created_at'
        toolbarFilters={toolbarFilters}
        urlColumnFilters={[
          { columnId: 'seller', searchKey: 'seller', type: 'string' },
        ]}
        BulkActions={WholesaleProductsBulkActions}
      />
      <ConfirmDialog
        open={!!removing}
        onOpenChange={(open) => !open && setRemoving(null)}
        title={t('products.deleteTitle')}
        desc={t('products.deleteDesc', { name: removing?.name })}
        confirmText={t('actions.delete')}
        destructive
        isLoading={removeProduct.isPending}
        handleConfirm={() =>
          removing &&
          removeProduct.mutate(removing.id, {
            onSettled: () => setRemoving(null),
          })
        }
      />
    </>
  )
}
