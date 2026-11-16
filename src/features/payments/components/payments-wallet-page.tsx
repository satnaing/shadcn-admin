import { useCallback, useState } from 'react'
import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { AdminPageShell } from '@/components/admin/admin-page-shell'
import { EntityDataTable } from '@/components/data-table'
import { PermissionGuard } from '@/components/guard'
import { Button } from '@/components/ui/button'
import type { NavigateFn } from '@/hooks/use-table-url-state'
import { PERMISSIONS } from '@/shared/permissions'
import { toServerListParams } from '@/shared/utils/list-query-string'
import { WALLET_TABS, type WalletRequest } from '../data/payments.type'
import { usePaymentsWallet } from '../hooks/use-payments'
import { usePaymentsMutations } from '../hooks/use-payments-mutations'
import { PaymentsRechargeDialog } from './payments-recharge-dialog'
import { PaymentsTabs } from './payments-tabs'
import { PaymentsWalletBulk } from './payments-wallet-bulk'
import { usePaymentsWalletColumns } from './payments-wallet-columns'

interface Props {
  search: Record<string, unknown>
  navigate: NavigateFn
}

/** Offline wallet recharge requests: customers' receipts to approve, plus top-ups made by the admin. */
export function PaymentsWalletPage({ search, navigate }: Props) {
  const { t } = useTranslation('payments')
  const [recharging, setRecharging] = useState(false)
  const { approveWallet } = usePaymentsMutations()
  const onApprove = useCallback((r: WalletRequest) => approveWallet.mutate([r.id]), [approveWallet])
  const columns = usePaymentsWalletColumns(onApprove, approveWallet.isPending)
  const { data } = usePaymentsWallet(toServerListParams(search, { filters: ['tab'], defaultSort: 'created_at' }))

  return (
    <AdminPageShell
      title={t('wallet.title')}
      description={t('wallet.description')}
      actions={
        <PermissionGuard permission={PERMISSIONS.PAYMENTS.WALLET_MANAGE}>
          <Button onClick={() => setRecharging(true)}>
            <Plus className='me-2 size-4' />
            {t('wallet.recharge')}
          </Button>
        </PermissionGuard>
      }
    >
      <PaymentsTabs tabs={WALLET_TABS} labelPrefix='wallet.tabs' search={search} navigate={navigate} />
      <EntityDataTable
        data={data?.data ?? []}
        meta={data?.meta}
        search={search}
        navigate={navigate}
        columns={columns}
        searchPlaceholder={t('wallet.search')}
        noResultsMessage={t('wallet.empty')}
        enableStatusFilter={false}
        defaultSort='created_at'
        BulkActions={PaymentsWalletBulk}
      />
      {recharging && <PaymentsRechargeDialog open onOpenChange={(open) => !open && setRecharging(false)} />}
    </AdminPageShell>
  )
}
