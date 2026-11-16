import { useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { useCurrencyFormatter } from '@/shared/hooks/useCurrencyFormatter'
import { toServerListParams } from '@/shared/utils/list-query-string'
import { useTranslation } from 'react-i18next'
import type { NavigateFn } from '@/hooks/use-table-url-state'
import { AdminPageShell } from '@/components/admin/admin-page-shell'
import { EntityDataTable } from '@/components/data-table'
import { translatedColumnHeader } from '@/components/data-table/column-header'
import type { CommissionItem } from '../data/preorder.type'
import { useCommissions } from '../hooks/use-preorder'
import { PreorderDateRange } from './preorder-date-range'

const h = (key: string) =>
  translatedColumnHeader<CommissionItem, unknown>(
    `preorder:commissions.columns.${key}`
  )

interface Props {
  search: Record<string, unknown>
  navigate: NavigateFn
}

/** What the platform earned from delivered seller preorders (read-only history). */
export function PreorderCommissionsPage({ search, navigate }: Props) {
  const { t } = useTranslation('preorder')
  const { formatMoney } = useCurrencyFormatter()
  const { data } = useCommissions(
    toServerListParams(search, {
      filters: ['from', 'to'],
      defaultSort: 'created_at',
    })
  )
  const columns = useMemo<ColumnDef<CommissionItem>[]>(
    () => [
      { accessorKey: 'order_code', ...h('order') },
      { accessorKey: 'seller_name', ...h('seller') },
      {
        accessorKey: 'admin_commission',
        ...h('commission'),
        cell: ({ row }) => formatMoney(row.original.admin_commission),
      },
      {
        accessorKey: 'seller_earning',
        ...h('earning'),
        cell: ({ row }) => formatMoney(row.original.seller_earning),
      },
      {
        accessorKey: 'created_at',
        ...h('date'),
        cell: ({ row }) => row.original.created_at.slice(0, 10),
      },
    ],
    [formatMoney]
  )

  return (
    <AdminPageShell
      title={t('commissions.title')}
      description={t('commissions.description')}
    >
      <PreorderDateRange search={search} navigate={navigate} />
      <EntityDataTable
        data={data?.data ?? []}
        meta={data?.meta}
        search={search}
        navigate={navigate}
        columns={columns}
        searchPlaceholder={t('commissions.search')}
        noResultsMessage={t('commissions.empty')}
        enableRowSelection={false}
        enableStatusFilter={false}
        defaultSort='created_at'
      />
    </AdminPageShell>
  )
}
