import { useState } from 'react'
import { Plus, Search } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { AdminHeader } from '@/components/admin/admin-header'
import { Main } from '@/components/layout/main'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FlashDealsTable } from './components/flash-deals-table'
import { useFlashDeals, usePromotionMutations } from './hooks/usePromotions'

export function FlashDeals() {
  const { t } = useTranslation('promotions')
  const [search, setSearch] = useState('')

  const { data, isLoading } = useFlashDeals({ search })
  const { flashDealStatusMutation, flashDealFeaturedMutation, deleteFlashDealMutation } =
    usePromotionMutations()

  const deals = data?.data ?? []

  const handleDelete = (id: number) => {
    if (window.confirm('Bu flash satışı silmək istədiyinizə əminsiniz?')) {
      deleteFlashDealMutation.mutate(id, {
        onSuccess: () => toast.success('Flash satış kampaniyası silindi!'),
      })
    }
  }

  return (
    <>
      <AdminHeader />
      <Main fluid className='space-y-4'>
        <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
          <div>
            <h1 className='text-2xl font-bold tracking-tight'>
              {t('titles.flashDeals', 'Flash Satışlar (Flash Deals)')}
            </h1>
            <p className='text-sm text-muted-foreground'>
              {t('titles.flashDealsSubtitle', 'Müəyyən vaxt intervalında fəaliyyət göstərən böyük endirim aksiyaları')}
            </p>
          </div>
          <Button asChild className='gap-2'>
            <Link to='/admin/promotions/flash-deals/create'>
              <Plus className='size-4' />
              {t('deals.addNew', 'Yeni Flash Satış')}
            </Link>
          </Button>
        </div>

        <div className='flex flex-col gap-4 rounded-lg border bg-card p-4'>
          <div className='max-w-sm'>
            <div className='relative'>
              <Search className='absolute left-2.5 top-2.5 size-4 text-muted-foreground' />
              <Input
                placeholder='Kampaniya adı axtar...'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className='pl-8'
              />
            </div>
          </div>

          <FlashDealsTable
            deals={deals}
            isLoading={isLoading}
            onToggleStatus={(id, st) => flashDealStatusMutation.mutate({ id, status: !st })}
            onToggleFeatured={(id, ft) => flashDealFeaturedMutation.mutate({ id, featured: !ft })}
            onDelete={handleDelete}
          />
        </div>
      </Main>
    </>
  )
}

export default FlashDeals
