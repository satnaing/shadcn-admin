import { useState } from 'react'
import { Plus, Search } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { AdminHeader } from '@/components/admin/admin-header'
import { Main } from '@/components/layout/main'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CouponsTable } from './components/coupons-table'
import { useCoupons, usePromotionMutations } from './hooks/usePromotions'

export function Coupons() {
  const { t } = useTranslation('promotions')
  const [search, setSearch] = useState('')
  const [type, setType] = useState<string>('all')

  const { data, isLoading } = useCoupons({ search, type: type === 'all' ? undefined : type })
  const { couponStatusMutation, deleteCouponMutation } = usePromotionMutations()

  const coupons = data?.data ?? []

  const handleDelete = (id: number) => {
    if (window.confirm('Bu kuponu silmək istədiyinizə əminsiniz?')) {
      deleteCouponMutation.mutate(id, {
        onSuccess: () => toast.success('Kupon silindi!'),
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
              {t('titles.coupons', 'Endirim Kuponları')}
            </h1>
            <p className='text-sm text-muted-foreground'>
              {t('titles.couponsSubtitle', 'Promokodlar, səbət endirimləri və qeydiyyat kuponlarının idarəsi')}
            </p>
          </div>
          <Button asChild className='gap-2'>
            <Link to='/admin/promotions/coupons/create'>
              <Plus className='size-4' />
              {t('coupons.addNew', 'Yeni Kupon Yarat')}
            </Link>
          </Button>
        </div>

        <div className='flex flex-col gap-4 rounded-lg border bg-card p-4'>
          <div className='flex flex-col gap-3 sm:flex-row sm:items-center'>
            <div className='relative flex-1 max-w-sm'>
              <Search className='absolute left-2.5 top-2.5 size-4 text-muted-foreground' />
              <Input
                placeholder='Kupon kodu axtar...'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className='pl-8'
              />
            </div>

            <Select value={type} onValueChange={setType}>
              <SelectTrigger className='w-[180px]'>
                <SelectValue placeholder='Kupon Növü' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>Bütün Növlər</SelectItem>
                <SelectItem value='product_base'>Məhsul üzrə</SelectItem>
                <SelectItem value='cart_base'>Səbət üzrə</SelectItem>
                <SelectItem value='welcome_base'>Xoşgəldin Kuponu</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <CouponsTable
            coupons={coupons}
            isLoading={isLoading}
            onToggleStatus={(id, st) => couponStatusMutation.mutate({ id, status: !st })}
            onDelete={handleDelete}
          />
        </div>
      </Main>
    </>
  )
}

export default Coupons
