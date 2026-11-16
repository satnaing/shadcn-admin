import { useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { Printer } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { toServerListParams } from '@/shared/utils/list-query-string'
import { useCurrencyFormatter } from '@/shared/hooks/useCurrencyFormatter'
import type { NavigateFn } from '@/hooks/use-table-url-state'
import { AdminPageShell } from '@/components/admin/admin-page-shell'
import { EntityDataTable } from '@/components/data-table'
import { translatedColumnHeader } from '@/components/data-table/column-header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { PosOrderItem } from '../data/pos.type'
import { usePosOrders, usePosSettings } from '../hooks/use-pos'
import { usePosMutations } from '../hooks/use-pos-mutations'
import { PosTabs } from './pos-tabs'

const h = (key: string) => translatedColumnHeader<PosOrderItem, unknown>(`pos:columns.${key}`)
const TABS = ['all', 'paid', 'unpaid'] as const

interface Props {
  search: Record<string, unknown>
  navigate: NavigateFn
}

/** Orders placed at a POS terminal. Details and delivery belong to the orders module; here only the thermal receipt. */
export function PosOrdersPage({ search, navigate }: Props) {
  const { t } = useTranslation('pos')
  const { formatMoney } = useCurrencyFormatter()
  const { receipt } = usePosMutations()
  const printWidth = usePosSettings().data?.data.print_width
  const { data } = usePosOrders(toServerListParams(search, { filters: ['tab'], defaultSort: 'date' }))
  const columns = useMemo<ColumnDef<PosOrderItem>[]>(
    () => [
      // shortcut: plain #code until the orders module has a detail route to link to
      { accessorKey: 'code', ...h('code'), cell: ({ row }) => `#${row.original.code}` },
      {
        accessorKey: 'date',
        ...h('date'),
        cell: ({ row }) => row.original.date.slice(0, 16).replace('T', ' '),
      },
      { accessorKey: 'customer', ...h('customer') },
      {
        accessorKey: 'source',
        ...h('source'),
        cell: ({ row }) => t(`source.${row.original.source}`),
      },
      { accessorKey: 'items_count', ...h('items') },
      {
        accessorKey: 'grand_total',
        ...h('total'),
        cell: ({ row }) => formatMoney(row.original.grand_total),
      },
      {
        accessorKey: 'payment_type',
        ...h('payment'),
        cell: ({ row }) => t(`payment.${row.original.payment_type}`),
      },
      {
        accessorKey: 'payment_status',
        ...h('status'),
        cell: ({ row }) => (
          <Badge variant={row.original.payment_status === 'paid' ? 'secondary' : 'outline'}>
            {t(`status.${row.original.payment_status}`)}
          </Badge>
        ),
      },
      { accessorKey: 'operator', ...h('operator') },
      {
        id: 'actions',
        enableSorting: false,
        header: () => null,
        cell: ({ row }) => (
          <Button
            size='icon'
            variant='ghost'
            aria-label={t('actions.receipt')}
            onClick={() =>
              printWidth ? receipt.mutate(row.original.id) : toast.warning(t('checkout.noWidth'))
            }
          >
            <Printer className='size-4' />
          </Button>
        ),
      },
    ],
    [t, formatMoney, receipt, printWidth]
  )

  return (
    <AdminPageShell title={t('orders.title')} description={t('orders.description')}>
      <PosTabs items={TABS} labelKey='tabs' search={search} navigate={navigate} />
      <EntityDataTable
        data={data?.data ?? []}
        meta={data?.meta}
        search={search}
        navigate={navigate}
        columns={columns}
        searchPlaceholder={t('orders.search')}
        noResultsMessage={t('orders.empty')}
        enableRowSelection={false}
        enableStatusFilter={false}
        defaultSort='date'
      />
    </AdminPageShell>
  )
}
