import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { AdminHeader } from '@/components/admin/admin-header'
import { Main } from '@/components/layout/main'
import { SellerDetailDialog } from './components/seller-detail-dialog'
import { SellerFilterBar } from './components/seller-filter-bar'
import { SellersTable } from './components/sellers-table'
import { type SellerFilterParams, type SellerItem } from './data/sellers.type'
import { useSellerMutations, useSellers } from './hooks/useSellers'

export function SellersPending() {
  const { t } = useTranslation('sellers')
  const [filters, setFilters] = useState<SellerFilterParams>({
    page: 1,
    per_page: 10,
    is_approved: false,
  })
  const [selectedSeller, setSelectedSeller] = useState<SellerItem | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)

  const { data, isLoading } = useSellers(filters)
  const { approvalMutation, banMutation } = useSellerMutations()

  const sellers = data?.data ?? []

  const handleApprove = (id: number, current: boolean) => {
    approvalMutation.mutate(
      { id, is_approved: !current },
      {
        onSuccess: () => {
          toast.success(t('messages.approvalUpdated', 'Satıcı təsdiq statusu yeniləndi!'))
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
            {t('titles.pending', 'Qeydiyyat Gözləyən Satıcılar')}
          </h1>
          <p className='text-sm text-muted-foreground'>
            {t('titles.pendingSubtitle', 'Təsdiq gözləyən yeni mağaza və satıcı müraciətləri')}
          </p>
        </div>

        <div className='flex flex-col gap-4 rounded-lg border bg-card p-4'>
          <SellerFilterBar
            filters={filters}
            onChange={setFilters}
            onReset={() => setFilters({ page: 1, per_page: 10, is_approved: false })}
            hideApprovalFilter
          />

          <SellersTable
            sellers={sellers}
            isLoading={isLoading}
            onView={(s) => {
              setSelectedSeller(s)
              setDetailOpen(true)
            }}
            onPay={() => {}}
            onToggleApproval={handleApprove}
            onToggleBan={(id, cur) => banMutation.mutate({ id, is_banned: !cur })}
          />
        </div>

        <SellerDetailDialog
          seller={selectedSeller}
          open={detailOpen}
          onOpenChange={setDetailOpen}
          onToggleApproval={handleApprove}
          onToggleBan={(id, cur) => banMutation.mutate({ id, is_banned: !cur })}
        />
      </Main>
    </>
  )
}

export default SellersPending
