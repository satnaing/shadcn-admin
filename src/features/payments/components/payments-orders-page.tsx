import { useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import { AdminPageShell } from '@/components/admin/admin-page-shell'
import { EntityDataTable } from '@/components/data-table'
import { translatedColumnHeader } from '@/components/data-table/column-header'
import { Badge } from '@/components/ui/badge'
import type { NavigateFn } from '@/hooks/use-table-url-state'
import { useCurrencyFormatter } from '@/shared/hooks/useCurrencyFormatter'
import { toServerListParams } from '@/shared/utils/list-query-string'
import { ORDER_PAYMENT_STATUSES, type OfflineOrder } from '../data/payments.type'
import { usePaymentsOrders } from '../hooks/use-payments'
import { PaymentsReceiptLink } from './payments-receipt-link'
import { PaymentsTabs } from './payments-tabs'

const h = (key: string) => translatedColumnHeader<OfflineOrder, unknown>(`payments:orders.columns.${key}`)
const TABS = ['all', ...ORDER_PAYMENT_STATUSES] as const

interface Props {
  search: Record<string, unknown>
  navigate: NavigateFn
}

/**
 * Orders paid through a manual method (AEC reused the sales list with `manual_payment = 1`).
 * Marking the payment as paid is done on the order itself (orders module), so this list is read-only.
 */
export function PaymentsOrdersPage({ search, navigate }: Props) {
  const { t } = useTranslation('payments')
  const { formatMoney } = useCurrencyFormatter()
  const { data } = usePaymentsOrders(toServerListParams(search, { filters: ['tab'], defaultSort: 'created_at' }))
  const columns = useMemo<ColumnDef<OfflineOrder>[]>(
    () => [
      { accessorKey: 'code', ...h('code'), cell: ({ row }) => <span className='font-medium'>#{row.original.code}</span> },
      { accessorKey: 'customer', ...h('customer') },
      { accessorKey: 'method', enableSorting: false, ...h('method') },
      { accessorKey: 'amount', ...h('amount'), cell: ({ row }) => formatMoney(row.original.amount) },
      { accessorKey: 'trx_id', enableSorting: false, ...h('trxId') },
      {
        accessorKey: 'receipt',
        enableSorting: false,
        ...h('receipt'),
        cell: ({ row }) => <PaymentsReceiptLink url={row.original.receipt} />,
      },
      {
        accessorKey: 'payment_status',
        ...h('status'),
        cell: ({ row }) => (
          <Badge variant={row.original.payment_status === 'paid' ? 'default' : 'outline'}>
            {t(`orders.status.${row.original.payment_status}`)}
          </Badge>
        ),
      },
      { accessorKey: 'created_at', ...h('date'), cell: ({ row }) => row.original.created_at.slice(0, 10) },
    ],
    [t, formatMoney]
  )

  return (
    <AdminPageShell title={t('orders.title')} description={t('orders.description')}>
      <PaymentsTabs tabs={TABS} labelPrefix='orders.tabs' search={search} navigate={navigate} />
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
        defaultSort='created_at'
      />
    </AdminPageShell>
  )
}
