import { useTranslation } from 'react-i18next'
import { AdminHeader } from '@/components/admin/admin-header'
import { Main } from '@/components/layout/main'
import { PayoutRequestsTable } from './components/payout-requests-table'
import { usePayoutRequests } from './hooks/useSellers'

export function SellerPayouts() {
  const { t } = useTranslation('sellers')
  const { data, isLoading } = usePayoutRequests({ status: 'paid' })
  const requests = data?.data ?? []

  return (
    <>
      <AdminHeader />
      <Main fluid className='space-y-4'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>
            {t('titles.payoutHistory', 'Ödəniş Tarixçəsi (Payouts)')}
          </h1>
          <p className='text-sm text-muted-foreground'>
            {t('titles.payoutHistorySubtitle', 'Satıcılara həyata keçirilmiş bütün uğurlu ödənişlər')}
          </p>
        </div>

        <div className='flex flex-col gap-4 rounded-lg border bg-card p-4'>
          <PayoutRequestsTable
            requests={requests}
            isLoading={isLoading}
            onUpdateStatus={() => {}}
          />
        </div>
      </Main>
    </>
  )
}

export default SellerPayouts
