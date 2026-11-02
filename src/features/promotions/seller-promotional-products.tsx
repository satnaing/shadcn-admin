import { useState } from 'react'
import { Search } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { AdminHeader } from '@/components/admin/admin-header'
import { Main } from '@/components/layout/main'
import { Input } from '@/components/ui/input'
import { PromotionalProductsTable } from './components/promotional-products-table'
import { usePromotionalProducts } from './hooks/usePromotions'

export function SellerPromotionalProducts() {
  const { t } = useTranslation('promotions')
  const [search, setSearch] = useState('')

  const { data, isLoading } = usePromotionalProducts({ added_by: 'seller', search })
  const products = data?.data ?? []

  return (
    <>
      <AdminHeader />
      <Main fluid className='space-y-4'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>
            {t('titles.sellerPromotionalProducts', 'Satıcı Promosiya Məhsulları')}
          </h1>
          <p className='text-sm text-muted-foreground'>
            {t('titles.sellerPromotionalProductsSubtitle', 'Yalnız tərəfdaş satıcılar tərəfindən kampaniyalara qoşulmuş məhsullar')}
          </p>
        </div>

        <div className='flex flex-col gap-4 rounded-lg border bg-card p-4'>
          <div className='max-w-sm'>
            <div className='relative'>
              <Search className='absolute left-2.5 top-2.5 size-4 text-muted-foreground' />
              <Input
                placeholder='Satıcı və ya məhsul axtar...'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className='pl-8'
              />
            </div>
          </div>

          <PromotionalProductsTable products={products} isLoading={isLoading} />
        </div>
      </Main>
    </>
  )
}

export default SellerPromotionalProducts
