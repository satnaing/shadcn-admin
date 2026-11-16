import { useMemo, useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { useCurrencyFormatter } from '@/shared/hooks/useCurrencyFormatter'
import { PERMISSIONS } from '@/shared/permissions'
import { Ban, Wallet } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { NavigateFn } from '@/hooks/use-table-url-state'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { translatedColumnHeader } from '@/components/data-table/column-header'
import { PermissionGuard } from '@/components/guard'
import { WITHDRAW_TABS, type WithdrawItem } from '../data/affiliate.type'
import { useAffiliateMutations } from '../hooks/use-affiliate-mutations'
import { AffiliateBadge } from './affiliate-badge'
import { AffiliateList } from './affiliate-list'
import { AffiliatePayDialog } from './affiliate-pay-dialog'

const h = (key: string) =>
  translatedColumnHeader<WithdrawItem, unknown>(`affiliate:columns.${key}`)

interface Props {
  search: Record<string, unknown>
  navigate: NavigateFn
}

/** Withdraw requests of affiliates: pay (records the payment) or reject (returns the held balance). */
export function AffiliateWithdrawsPage({ search, navigate }: Props) {
  const { t } = useTranslation('affiliate')
  const { formatMoney } = useCurrencyFormatter()
  const { rejectWithdraw } = useAffiliateMutations()
  const [paying, setPaying] = useState<WithdrawItem | null>(null)
  const [rejecting, setRejecting] = useState<WithdrawItem | null>(null)
  const tabs = WITHDRAW_TABS.map((value) => ({
    value,
    label: t(value === 'all' ? 'tabs.all' : `status.${value}`),
  }))
  const columns = useMemo<ColumnDef<WithdrawItem>[]>(() => {
    const noAction = (
      <span className='block text-end text-xs text-muted-foreground'>
        {t('withdraws.noAction')}
      </span>
    )
    return [
      {
        accessorKey: 'requested_at',
        ...h('date'),
        cell: ({ row }) =>
          row.original.requested_at.slice(0, 16).replace('T', ' '),
      },
      { accessorKey: 'name', ...h('name') },
      { accessorKey: 'email', ...h('email') },
      {
        accessorKey: 'amount',
        ...h('amount'),
        cell: ({ row }) => formatMoney(row.original.amount),
      },
      {
        accessorKey: 'status',
        enableSorting: false,
        ...h('status'),
        cell: ({ row }) => (
          <AffiliateBadge group='status' value={row.original.status} />
        ),
      },
      {
        id: 'actions',
        enableSorting: false,
        enableHiding: false,
        header: () => null,
        cell: ({ row }) =>
          row.original.status === 'pending' ? (
            <PermissionGuard
              permission={PERMISSIONS.AFFILIATE.WITHDRAWS_MANAGE}
              fallback={noAction}
            >
              <div className='flex justify-end gap-1'>
                <Button
                  size='sm'
                  variant='outline'
                  onClick={() => setPaying(row.original)}
                >
                  <Wallet className='me-2 size-4' />
                  {t('actions.pay')}
                </Button>
                <Button
                  size='icon'
                  variant='ghost'
                  aria-label={t('actions.reject')}
                  onClick={() => setRejecting(row.original)}
                >
                  <Ban className='size-4 text-destructive' />
                </Button>
              </div>
            </PermissionGuard>
          ) : (
            noAction
          ),
      },
    ]
  }, [t, formatMoney])

  return (
    <AffiliateList
      kind='withdraws'
      columns={columns}
      tabs={tabs}
      defaultSort='requested_at'
      search={search}
      navigate={navigate}
    >
      <AffiliatePayDialog
        userId={paying?.affiliate_user_id ?? null}
        withdraw={paying ? { id: paying.id, amount: paying.amount } : null}
        onClose={() => setPaying(null)}
      />
      <ConfirmDialog
        open={!!rejecting}
        onOpenChange={(open) => !open && setRejecting(null)}
        title={t('withdraws.rejectTitle')}
        desc={t('withdraws.rejectDesc', {
          name: rejecting?.name,
          amount: formatMoney(rejecting?.amount ?? 0),
        })}
        confirmText={t('actions.reject')}
        destructive
        isLoading={rejectWithdraw.isPending}
        handleConfirm={() =>
          rejecting &&
          rejectWithdraw.mutate(rejecting.id, {
            onSuccess: () => setRejecting(null),
          })
        }
      />
    </AffiliateList>
  )
}
