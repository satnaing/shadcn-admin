import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { AdminHeader } from '@/components/admin/admin-header'
import { Main } from '@/components/layout/main'
import { SellerDetailDialog } from './components/seller-detail-dialog'
import { SellerFilterBar } from './components/seller-filter-bar'
import { SellerPayDialog } from './components/seller-pay-dialog'
import { SellersTable } from './components/sellers-table'
import { type SellerFilterParams, type SellerItem } from './data/sellers.type'
import { useSellerMutations, useSellers } from './hooks/useSellers'

export function SellersList() {
  const { t } = useTranslation('sellers')
  const [filters, setFilters] = useState<SellerFilterParams>({ page: 1, per_page: 10 })
  const [selectedSeller, setSelectedSeller] = useState<SellerItem | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [paySeller, setPaySeller] = useState<SellerItem | null>(null)
  const [payOpen, setPayOpen] = useState(false)

  const { data, isLoading } = useSellers(filters)
  const { approvalMutation, banMutation, payMutation } = useSellerMutations()

  const sellers = data?.data ?? []

  const handlePay = (id: number, amount: number, method: string, note?: string) => {
    payMutation.mutate(
      { id, amount, payment_method: method, note },
      {
        onSuccess: () => {
          toast.success(t('messages.paymentSuccess', 'Ödəniş uğurla qeydə alındı!'))
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
            {t('titles.all', 'Bütün Satıcılar')}
          </h1>
          <p className='text-sm text-muted-foreground'>
            {t('titles.allSubtitle', 'Platformadakı bütün aktiv və qeydiyyatdan keçmiş satıcılar')}
          </p>
        </div>

        <div className='flex flex-col gap-4 rounded-lg border bg-card p-4'>
          <SellerFilterBar
            filters={filters}
            onChange={setFilters}
            onReset={() => setFilters({ page: 1, per_page: 10 })}
          />

          <SellersTable
            sellers={sellers}
            isLoading={isLoading}
            onView={(s) => {
              setSelectedSeller(s)
              setDetailOpen(true)
            }}
            onPay={(s) => {
              setPaySeller(s)
              setPayOpen(true)
            }}
            onToggleApproval={(id, cur) => approvalMutation.mutate({ id, is_approved: !cur })}
            onToggleBan={(id, cur) => banMutation.mutate({ id, is_banned: !cur })}
          />
        </div>

        <SellerDetailDialog
          seller={selectedSeller}
          open={detailOpen}
          onOpenChange={setDetailOpen}
          onToggleApproval={(id, cur) => approvalMutation.mutate({ id, is_approved: !cur })}
          onToggleBan={(id, cur) => banMutation.mutate({ id, is_banned: !cur })}
        />

        <SellerPayDialog
          seller={paySeller}
          open={payOpen}
          onOpenChange={setPayOpen}
          onPay={handlePay}
        />
      </Main>
    </>
  )
}

export default SellersList
