import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { AdminHeader } from '@/components/admin/admin-header'
import { Main } from '@/components/layout/main'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { PayoutRequestsTable } from './components/payout-requests-table'
import { usePayoutRequests, useSellerMutations } from './hooks/useSellers'

export function SellerPayoutRequests() {
  const { t } = useTranslation('sellers')
  const [status, setStatus] = useState<string>('all')

  const { data, isLoading } = usePayoutRequests({ status: status === 'all' ? undefined : status })
  const { payoutStatusMutation } = useSellerMutations()

  const requests = data?.data ?? []

  const handleUpdateStatus = (id: number, nextStatus: 'paid' | 'rejected') => {
    payoutStatusMutation.mutate(
      { id, status: nextStatus },
      {
        onSuccess: () => {
          toast.success(
            nextStatus === 'paid'
              ? t('messages.payoutApproved', 'Çıxarış təsdiqləndi və ödənildi!')
              : t('messages.payoutRejected', 'Çıxarış sorğusuna imtina edildi!')
          )
        },
      }
    )
  }

  return (
    <>
      <AdminHeader />
      <Main fluid className='space-y-4'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>
            {t('titles.payoutRequests', 'Satıcı Çıxarış Sorğuları')}
          </h1>
          <p className='text-sm text-muted-foreground'>
            {t('titles.payoutRequestsSubtitle', 'Satıcıların balans çıxarış və köçürmə müraciətləri')}
          </p>
        </div>

        <div className='flex flex-col gap-4 rounded-lg border bg-card p-4'>
          <div className='flex items-center gap-3'>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className='w-[180px]'>
                <SelectValue placeholder={t('payout.allStatus', 'Bütün Statuslar')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>{t('payout.allStatus', 'Bütün Statuslar')}</SelectItem>
                <SelectItem value='pending'>{t('payout.pending', 'Gözləyir')}</SelectItem>
                <SelectItem value='paid'>{t('payout.paid', 'Ödənilib')}</SelectItem>
                <SelectItem value='rejected'>{t('payout.rejected', 'İmtina edilib')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <PayoutRequestsTable
            requests={requests}
            isLoading={isLoading}
            onUpdateStatus={handleUpdateStatus}
          />
        </div>
      </Main>
    </>
  )
}

export default SellerPayoutRequests
