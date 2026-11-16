import { useCallback, useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { Check } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { AdminPageShell } from '@/components/admin/admin-page-shell'
import { EntityDataTable } from '@/components/data-table'
import { translatedColumnHeader } from '@/components/data-table/column-header'
import { PermissionGuard } from '@/components/guard'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { NavigateFn } from '@/hooks/use-table-url-state'
import { PERMISSIONS } from '@/shared/permissions'
import { toServerListParams } from '@/shared/utils/list-query-string'
import type { PackageKind, PackageRequest } from '../data/payments.type'
import { usePaymentsPackages } from '../hooks/use-payments'
import { usePaymentsMutations } from '../hooks/use-payments-mutations'
import { PaymentsReceiptLink } from './payments-receipt-link'

const h = (key: string) => translatedColumnHeader<PackageRequest, unknown>(`payments:packages.columns.${key}`)
const MANAGE = {
  seller: PERMISSIONS.PAYMENTS.SELLER_PACKAGES_MANAGE,
  customer: PERMISSIONS.PAYMENTS.CUSTOMER_PACKAGES_MANAGE,
} as const

interface Props {
  kind: PackageKind
  search: Record<string, unknown>
  navigate: NavigateFn
}

/** Offline purchase requests of seller packages (`kind="seller"`) and customer packages (`kind="customer"`). */
export function PaymentsPackagesPage({ kind, search, navigate }: Props) {
  const { t } = useTranslation('payments')
  const { approvePackage } = usePaymentsMutations()
  const onApprove = useCallback((id: number) => approvePackage.mutate({ kind, id }), [approvePackage, kind])
  const { data } = usePaymentsPackages(kind, toServerListParams(search, { filters: [], defaultSort: 'created_at' }))
  const columns = useMemo<ColumnDef<PackageRequest>[]>(
    () => [
      { accessorKey: 'customer', ...h(kind === 'seller' ? 'seller' : 'customer'), cell: ({ row }) => <span className='font-medium'>{row.original.customer}</span> },
      { accessorKey: 'package', enableSorting: false, ...h('package'), cell: ({ row }) => row.original.package ?? t('packages.unavailable') },
      { accessorKey: 'method', enableSorting: false, ...h('method') },
      { accessorKey: 'trx_id', enableSorting: false, ...h('trxId') },
      {
        accessorKey: 'receipt',
        enableSorting: false,
        ...h('receipt'),
        cell: ({ row }) => <PaymentsReceiptLink url={row.original.receipt} />,
      },
      {
        accessorKey: 'approved',
        enableSorting: false,
        ...h('status'),
        cell: ({ row }) =>
          row.original.approved ? (
            <Badge>{t('packages.approved')}</Badge>
          ) : (
            <PermissionGuard permission={MANAGE[kind]} fallback={<Badge variant='outline'>{t('packages.pending')}</Badge>}>
              <Button size='sm' variant='outline' disabled={approvePackage.isPending} onClick={() => onApprove(row.original.id)}>
                <Check className='me-1 size-4' />
                {t('packages.approve')}
              </Button>
            </PermissionGuard>
          ),
      },
      { accessorKey: 'created_at', ...h('date'), cell: ({ row }) => row.original.created_at.slice(0, 10) },
    ],
    [t, kind, approvePackage.isPending, onApprove]
  )

  return (
    <AdminPageShell title={t(`packages.${kind}.title`)} description={t(`packages.${kind}.description`)}>
      <EntityDataTable
        data={data?.data ?? []}
        meta={data?.meta}
        search={search}
        navigate={navigate}
        columns={columns}
        searchPlaceholder={t('packages.search')}
        noResultsMessage={t('packages.empty')}
        enableRowSelection={false}
        enableStatusFilter={false}
        defaultSort='created_at'
      />
    </AdminPageShell>
  )
}
