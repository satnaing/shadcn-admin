import { useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { Check } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { translatedColumnHeader } from '@/components/data-table/column-header'
import { selectColumn } from '@/components/data-table/select-column'
import { PermissionGuard } from '@/components/guard'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useCurrencyFormatter } from '@/shared/hooks/useCurrencyFormatter'
import { PERMISSIONS } from '@/shared/permissions'
import type { WalletRequest } from '../data/payments.type'
import { PaymentsReceiptLink } from './payments-receipt-link'

const h = (key: string) => translatedColumnHeader<WalletRequest, unknown>(`payments:wallet.columns.${key}`)

export function usePaymentsWalletColumns(
  onApprove: (r: WalletRequest) => void,
  pending: boolean
): ColumnDef<WalletRequest>[] {
  const { t } = useTranslation('payments')
  const { formatMoney } = useCurrencyFormatter()

  return useMemo(
    () => [
      selectColumn<WalletRequest>(t('common.selectAll'), t('common.selectRow')),
      { accessorKey: 'customer', ...h('customer'), cell: ({ row }) => <span className='font-medium'>{row.original.customer}</span> },
      { accessorKey: 'amount', ...h('amount'), cell: ({ row }) => formatMoney(row.original.amount) },
      { accessorKey: 'method', enableSorting: false, ...h('method'), cell: ({ row }) => row.original.method ?? '—' },
      { accessorKey: 'trx_id', enableSorting: false, ...h('trxId') },
      {
        accessorKey: 'receipt',
        enableSorting: false,
        ...h('receipt'),
        cell: ({ row }) => <PaymentsReceiptLink url={row.original.receipt} />,
      },
      {
        accessorKey: 'added_by',
        enableSorting: false,
        ...h('addedBy'),
        cell: ({ row }) => <Badge variant='secondary'>{t(`wallet.addedBy.${row.original.added_by}`)}</Badge>,
      },
      {
        accessorKey: 'approved',
        enableSorting: false,
        ...h('status'),
        cell: ({ row }) =>
          row.original.approved ? (
            <Badge>{t('wallet.approved')}</Badge>
          ) : (
            <PermissionGuard permission={PERMISSIONS.PAYMENTS.WALLET_MANAGE} fallback={<Badge variant='outline'>{t('wallet.pending')}</Badge>}>
              <Button size='sm' variant='outline' disabled={pending} onClick={() => onApprove(row.original)}>
                <Check className='me-1 size-4' />
                {t('wallet.approve')}
              </Button>
            </PermissionGuard>
          ),
      },
      { accessorKey: 'created_at', ...h('date'), cell: ({ row }) => row.original.created_at.slice(0, 10) },
    ],
    [t, formatMoney, onApprove, pending]
  )
}
