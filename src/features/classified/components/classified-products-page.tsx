import { useCallback, useState } from 'react'
import { toServerListParams } from '@/shared/utils/list-query-string'
import { useTranslation } from 'react-i18next'
import type { NavigateFn } from '@/hooks/use-table-url-state'
import { AdminPageShell } from '@/components/admin/admin-page-shell'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { EntityDataTable } from '@/components/data-table'
import type { ClassifiedProduct } from '../data/classified.type'
import { useClassifiedProducts } from '../hooks/use-classified'
import { useClassifiedMutations } from '../hooks/use-classified-mutations'
import { ClassifiedProductsBulkActions } from './classified-products-bulk-actions'
import { useClassifiedProductColumns } from './classified-products-columns'

interface Props {
  search: Record<string, unknown>
  navigate: NavigateFn
}

/** Listings customers and sellers uploaded: the admin publishes or removes them (AEC "Classified Products"). */
export function ClassifiedProductsPage({ search, navigate }: Props) {
  const { t } = useTranslation('classified')
  const [removing, setRemoving] = useState<ClassifiedProduct | null>(null)
  const { setPublished, removeProduct } = useClassifiedMutations()
  const onPublish = useCallback(
    (p: ClassifiedProduct) =>
      setPublished.mutate({ id: p.id, is_published: !p.is_published }),
    [setPublished]
  )
  const columns = useClassifiedProductColumns(onPublish, setRemoving)
  const { data } = useClassifiedProducts(
    toServerListParams(search, { defaultSort: '-created_at' })
  )

  return (
    <AdminPageShell
      title={t('products.title')}
      description={t('products.description')}
    >
      <EntityDataTable
        data={data?.data ?? []}
        meta={data?.meta}
        search={search}
        navigate={navigate}
        columns={columns}
        searchPlaceholder={t('products.search')}
        noResultsMessage={t('products.empty')}
        enableStatusFilter={false}
        defaultSort='-created_at'
        BulkActions={ClassifiedProductsBulkActions}
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
    </AdminPageShell>
  )
}
