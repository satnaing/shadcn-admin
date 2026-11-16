import { useCallback, useMemo, useState } from 'react'
import { toServerListParams } from '@/shared/utils/list-query-string'
import { useTranslation } from 'react-i18next'
import type { NavigateFn } from '@/hooks/use-table-url-state'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { EntityDataTable } from '@/components/data-table'
import type { ProductFlag, ProductListItem } from '../data/preorder.type'
import { useProducts } from '../hooks/use-preorder'
import { usePreorderMutations } from '../hooks/use-preorder-mutations'
import { PreorderProductsBulkActions } from './preorder-products-bulk-actions'
import { usePreorderProductColumns } from './preorder-products-columns'

interface Props {
  search: Record<string, unknown>
  navigate: NavigateFn
}

const STATES = ['published', 'unpublished', 'featured'] as const

export function PreorderProductsTable({ search, navigate }: Props) {
  const { t } = useTranslation('preorder')
  const [removing, setRemoving] = useState<ProductListItem | null>(null)
  const { setProductFlag, removeProduct } = usePreorderMutations()
  const onFlag = useCallback(
    (p: ProductListItem, flag: ProductFlag, value: boolean) =>
      setProductFlag.mutate({ id: p.id, flag, value }),
    [setProductFlag]
  )
  const columns = usePreorderProductColumns(onFlag, setRemoving)
  const { data } = useProducts(
    toServerListParams(search, { filters: ['owner', 'state'] })
  )
  const toolbarFilters = useMemo(
    () => [
      {
        columnId: 'state',
        title: t('products.columns.state'),
        mode: 'single' as const,
        options: STATES.map((s) => ({
          label: t(`products.state.${s}`),
          value: s,
        })),
      },
    ],
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
        searchPlaceholder={t('products.search')}
        noResultsMessage={t('products.empty')}
        enableStatusFilter={false}
        toolbarFilters={toolbarFilters}
        urlColumnFilters={[
          { columnId: 'state', searchKey: 'state', type: 'string' },
        ]}
        defaultColumnVisibility={{ state: false }}
        BulkActions={PreorderProductsBulkActions}
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
