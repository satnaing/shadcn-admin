import { useMemo, useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { useCurrencyFormatter } from '@/shared/hooks/useCurrencyFormatter'
import { PERMISSIONS } from '@/shared/permissions'
import { Ban } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { NavigateFn } from '@/hooks/use-table-url-state'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { translatedColumnHeader } from '@/components/data-table/column-header'
import { PermissionGuard } from '@/components/guard'
import { DELIVERY_STAGES, type DeliveryItem } from '../data/courier.type'
import { useCourierMutations } from '../hooks/use-courier-mutations'
import { CourierList } from './courier-list'

const h = (key: string) =>
  translatedColumnHeader<DeliveryItem, unknown>(`courier:columns.${key}`)
const CLOSED = ['delivered', 'cancelled']

interface Props {
  search: Record<string, unknown>
  navigate: NavigateFn
}

/** The courier's own deliveries by stage; a courier can ask to cancel an order that is still open. */
export function CourierDeliveriesPage({ search, navigate }: Props) {
  const { t } = useTranslation('courier')
  const { formatMoney } = useCurrencyFormatter()
  const { requestCancel } = useCourierMutations()
  const [target, setTarget] = useState<DeliveryItem | null>(null)
  const tabs = [
    { value: 'all', label: t('tabs.all') },
    ...DELIVERY_STAGES.map((value) => ({ value, label: t(`stage.${value}`) })),
  ]
  const columns = useMemo<ColumnDef<DeliveryItem>[]>(
    () => [
      {
        accessorKey: 'order_code',
        ...h('order'),
        cell: ({ row }) => `#${row.original.order_code}`,
      },
      { accessorKey: 'customer_name', ...h('customer') },
      { accessorKey: 'address', enableSorting: false, ...h('address') },
      {
        accessorKey: 'payment_type',
        enableSorting: false,
        ...h('payment'),
        cell: ({ row }) => (
          <Badge variant='outline'>
            {t(`payment.${row.original.payment_type}`)}
          </Badge>
        ),
      },
      {
        accessorKey: 'grand_total',
        ...h('total'),
        cell: ({ row }) => formatMoney(row.original.grand_total),
      },
      {
        accessorKey: 'delivery_status',
        enableSorting: false,
        ...h('status'),
        cell: ({ row }) => (
          <span className='flex items-center gap-2'>
            <Badge variant='secondary'>
              {t(`deliveryStatus.${row.original.delivery_status}`)}
            </Badge>
            {row.original.cancel_request && (
              <Badge variant='destructive'>
                {t('deliveries.cancelRequested')}
              </Badge>
            )}
          </span>
        ),
      },
      {
        id: 'actions',
        enableSorting: false,
        enableHiding: false,
        header: () => null,
        cell: ({ row }) =>
          !row.original.cancel_request &&
          !CLOSED.includes(row.original.delivery_status) ? (
            <PermissionGuard permission={PERMISSIONS.COURIER.DELIVERIES_MANAGE}>
              <div className='flex justify-end'>
                <Button
                  size='icon'
                  variant='ghost'
                  aria-label={t('actions.requestCancel')}
                  onClick={() => setTarget(row.original)}
                >
                  <Ban className='size-4' />
                </Button>
              </div>
            </PermissionGuard>
          ) : null,
      },
    ],
    [t, formatMoney]
  )

  return (
    <CourierList
      kind='deliveries'
      columns={columns}
      tabs={tabs}
      defaultSort='assigned_at'
      search={search}
      navigate={navigate}
    >
      <ConfirmDialog
        open={!!target}
        onOpenChange={(open) => !open && setTarget(null)}
        title={t('deliveries.cancelTitle')}
        desc={t('deliveries.cancelDesc', { code: target?.order_code })}
        destructive
        isLoading={requestCancel.isPending}
        handleConfirm={() =>
          target &&
          requestCancel.mutate(target.id, { onSuccess: () => setTarget(null) })
        }
      />
    </CourierList>
  )
}
