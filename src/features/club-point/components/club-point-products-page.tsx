import { useMemo, useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { useCurrencyFormatter } from '@/shared/hooks/useCurrencyFormatter'
import { PERMISSIONS } from '@/shared/permissions'
import { toServerListParams } from '@/shared/utils/list-query-string'
import { Pencil } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { NavigateFn } from '@/hooks/use-table-url-state'
import { Button } from '@/components/ui/button'
import { AdminPageShell } from '@/components/admin/admin-page-shell'
import { EntityDataTable } from '@/components/data-table'
import { translatedColumnHeader } from '@/components/data-table/column-header'
import { PermissionGuard } from '@/components/guard'
import type { ProductPointItem } from '../data/club-point.type'
import { useProductPoints } from '../hooks/use-club-point'
import { ClubPointAllCard, ClubPointRangeCard } from './club-point-bulk-cards'
import { ClubPointProductDialog } from './club-point-product-dialog'

const h = (key: string) =>
  translatedColumnHeader<ProductPointItem, unknown>(`club_point:columns.${key}`)

interface Props {
  search: Record<string, unknown>
  navigate: NavigateFn
}

/** Points per product: edit one, or set many at once by price range / price multiplier. */
export function ClubPointProductsPage({ search, navigate }: Props) {
  const { t } = useTranslation('club_point')
  const { formatMoney } = useCurrencyFormatter()
  const [editing, setEditing] = useState<ProductPointItem | null>(null)
  const params = toServerListParams(search, { defaultSort: 'id' })
  const { data } = useProductPoints(params)
  const columns = useMemo<ColumnDef<ProductPointItem>[]>(
    () => [
      { accessorKey: 'name', ...h('product') },
      {
        accessorKey: 'owner',
        ...h('owner'),
        cell: ({ row }) => row.original.owner ?? '—',
      },
      {
        accessorKey: 'unit_price',
        ...h('price'),
        cell: ({ row }) => formatMoney(row.original.unit_price),
      },
      { accessorKey: 'earn_point', ...h('points') },
      {
        id: 'actions',
        enableSorting: false,
        enableHiding: false,
        header: () => null,
        cell: ({ row }) => (
          <PermissionGuard permission={PERMISSIONS.CLUB_POINT.PRODUCTS_MANAGE}>
            <div className='flex justify-end'>
              <Button
                size='icon'
                variant='ghost'
                aria-label={t('actions.edit')}
                onClick={() => setEditing(row.original)}
              >
                <Pencil className='size-4' />
              </Button>
            </div>
          </PermissionGuard>
        ),
      },
    ],
    [t, formatMoney]
  )

  return (
    <AdminPageShell
      title={t('products.title')}
      description={t('products.description')}
    >
      <div className='grid gap-6 xl:grid-cols-2'>
        <ClubPointRangeCard />
        <ClubPointAllCard />
      </div>
      <EntityDataTable
        data={data?.data ?? []}
        meta={data?.meta}
        search={search}
        navigate={navigate}
        columns={columns}
        searchPlaceholder={t('products.search')}
        noResultsMessage={t('products.empty')}
        enableRowSelection={false}
        enableStatusFilter={false}
        defaultSort='id'
      />
      <ClubPointProductDialog
        product={editing}
        onClose={() => setEditing(null)}
      />
    </AdminPageShell>
  )
}
