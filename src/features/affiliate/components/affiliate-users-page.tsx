import { useMemo, useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { useCurrencyFormatter } from '@/shared/hooks/useCurrencyFormatter'
import { PERMISSIONS } from '@/shared/permissions'
import { History, Wallet } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { NavigateFn } from '@/hooks/use-table-url-state'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { translatedColumnHeader } from '@/components/data-table/column-header'
import { PermissionGuard } from '@/components/guard'
import { type AffiliateUserItem, USER_TABS } from '../data/affiliate.type'
import { AffiliateApprovalSwitch } from './affiliate-approval-switch'
import { AffiliateList } from './affiliate-list'
import { AffiliatePayDialog } from './affiliate-pay-dialog'
import { AffiliatePaymentsDialog } from './affiliate-payments-dialog'
import { AffiliateVerificationDialog } from './affiliate-verification-dialog'

const h = (key: string) =>
  translatedColumnHeader<AffiliateUserItem, unknown>(`affiliate:columns.${key}`)

interface Props {
  search: Record<string, unknown>
  navigate: NavigateFn
}

/** Affiliate users: review the application, approve, pay out and see the payment history. */
export function AffiliateUsersPage({ search, navigate }: Props) {
  const { t } = useTranslation('affiliate')
  const { formatMoney } = useCurrencyFormatter()
  const [verifyId, setVerifyId] = useState<number | null>(null)
  const [payId, setPayId] = useState<number | null>(null)
  const [history, setHistory] = useState<AffiliateUserItem | null>(null)
  const tabs = USER_TABS.map((value) => ({
    value,
    label: t(value === 'all' ? 'tabs.all' : `status.${value}`),
  }))
  const columns = useMemo<ColumnDef<AffiliateUserItem>[]>(
    () => [
      { accessorKey: 'name', ...h('name') },
      { accessorKey: 'phone', ...h('phone') },
      { accessorKey: 'email', ...h('email') },
      {
        id: 'verification',
        enableSorting: false,
        ...h('verification'),
        cell: ({ row }) =>
          row.original.has_verification ? (
            <Button
              variant='link'
              size='sm'
              className='h-auto p-0'
              onClick={() => setVerifyId(row.original.id)}
            >
              <Badge variant='secondary'>{t('actions.show')}</Badge>
            </Button>
          ) : (
            <span className='text-muted-foreground'>—</span>
          ),
      },
      {
        accessorKey: 'is_approved',
        enableSorting: false,
        ...h('approval'),
        cell: ({ row }) => <AffiliateApprovalSwitch user={row.original} />,
      },
      {
        accessorKey: 'balance',
        ...h('balance'),
        cell: ({ row }) => formatMoney(row.original.balance),
      },
      {
        id: 'actions',
        enableSorting: false,
        enableHiding: false,
        header: () => null,
        cell: ({ row }) => (
          <div className='flex justify-end gap-1'>
            <PermissionGuard permission={PERMISSIONS.AFFILIATE.USERS_PAY}>
              <Button
                size='icon'
                variant='ghost'
                aria-label={t('actions.pay')}
                disabled={row.original.balance <= 0}
                onClick={() => setPayId(row.original.id)}
              >
                <Wallet className='size-4' />
              </Button>
            </PermissionGuard>
            <PermissionGuard permission={PERMISSIONS.AFFILIATE.PAYMENTS}>
              <Button
                size='icon'
                variant='ghost'
                aria-label={t('actions.history')}
                onClick={() => setHistory(row.original)}
              >
                <History className='size-4' />
              </Button>
            </PermissionGuard>
          </div>
        ),
      },
    ],
    [t, formatMoney]
  )

  return (
    <AffiliateList
      kind='users'
      columns={columns}
      tabs={tabs}
      defaultSort='created_at'
      search={search}
      navigate={navigate}
    >
      <AffiliateVerificationDialog
        userId={verifyId}
        onClose={() => setVerifyId(null)}
      />
      <AffiliatePayDialog userId={payId} onClose={() => setPayId(null)} />
      <AffiliatePaymentsDialog
        user={history}
        onClose={() => setHistory(null)}
      />
    </AffiliateList>
  )
}
