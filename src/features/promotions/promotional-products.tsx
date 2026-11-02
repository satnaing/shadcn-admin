import { useState } from 'react'
import { Search } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { AdminHeader } from '@/components/admin/admin-header'
import { Main } from '@/components/layout/main'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { PromotionalProductsTable } from './components/promotional-products-table'
import { usePromotionalProducts } from './hooks/usePromotions'

export function PromotionalProducts() {
  const { t } = useTranslation('promotions')
  const [search, setSearch] = useState('')
  const [source, setSource] = useState<'all' | 'admin' | 'seller'>('all')

  const { data, isLoading } = usePromotionalProducts({ added_by: source, search })
  const products = data?.data ?? []

  return (
    <>
      <AdminHeader />
      <Main fluid className='space-y-4'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>
            {t('titles.promotionalProducts', 'Promosiya Məhsulları')}
          </h1>
          <p className='text-sm text-muted-foreground'>
            {t('titles.promotionalProductsSubtitle', 'Aktiv endirim aksiyalarında və kampaniyalarda iştirak edən bütün məhsullar')}
          </p>
        </div>

        <div className='flex flex-col gap-4 rounded-lg border bg-card p-4'>
          <div className='flex flex-col gap-3 sm:flex-row sm:items-center'>
            <div className='relative flex-1 max-w-sm'>
              <Search className='absolute left-2.5 top-2.5 size-4 text-muted-foreground' />
              <Input
                placeholder='Məhsul və ya aksiya adı...'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className='pl-8'
              />
            </div>

            <Select value={source} onValueChange={(v) => setSource(v as 'all' | 'admin' | 'seller')}>
              <SelectTrigger className='w-[160px]'>
                <SelectValue placeholder='Mənbə' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>Bütün Məhsullar</SelectItem>
                <SelectItem value='admin'>In-House (Admin)</SelectItem>
                <SelectItem value='seller'>Satıcı Məhsulları</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <PromotionalProductsTable products={products} isLoading={isLoading} />
        </div>
      </Main>
    </>
  )
}

export default PromotionalProducts
