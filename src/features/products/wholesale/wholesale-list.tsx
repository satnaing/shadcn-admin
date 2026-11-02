import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { AdminHeader } from '@/components/admin/admin-header'
import { Main } from '@/components/layout/main'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ProductFilterBar } from '../components/product-filter-bar'
import { ProductStockDialog } from '../components/product-stock-dialog'
import { ProductsTable } from '../components/products-table'
import type { ProductItem } from '../data/products.type'
import { useProductMutations, useProducts } from '../hooks/useProducts'

interface WholesaleListProps {
  initialType?: 'all' | 'in-house' | 'seller'
}

export function WholesaleList({ initialType = 'all' }: WholesaleListProps) {
  const { t } = useTranslation('products')
  const [activeTab, setActiveTab] = useState(initialType)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('id_desc')
  const [stockProduct, setStockProduct] = useState<ProductItem | null>(null)

  const { data, isLoading } = useProducts({
    type: activeTab,
    product_type: 'wholesale',
    search,
    status: statusFilter,
    sort: sortBy,
  })
  const { toggleStatus, deleteProduct, updateProduct } = useProductMutations()

  const allItems: ProductItem[] = data?.data ?? []
  const filteredProducts = allItems
    .filter((p) => p.wholesale_prices && p.wholesale_prices.length > 0)
    .filter((p) => {
      if (activeTab === 'in-house') return p.added_by === 'admin'
      if (activeTab === 'seller') return p.added_by === 'seller'
      return true
    })

  const handleStockSave = async (id: number, current_stock: number) => {
    await updateProduct({ id, data: { current_stock } })
  }

  return (
    <>
      <AdminHeader />
      <Main fluid className='space-y-4'>
        <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
          <div>
            <h1 className='text-2xl font-bold tracking-tight'>
              {t('wholesale.title', 'Topdan Satış Məhsulları')}
            </h1>
            <p className='text-sm text-muted-foreground'>
              {t('wholesale.subtitle', 'Pilləli xüsusi qiymət və minimum sifariş miqdarı ilə satılan məhsullar')}
            </p>
          </div>

          <Button asChild className='gap-2'>
            <Link to='/admin/wholesale-products/create'>
              <Plus className='size-4' />
              {t('wholesale.addNew', 'Yeni Topdan Məhsul')}
            </Link>
          </Button>
        </div>

        <div className='flex flex-col gap-3 rounded-lg border bg-card p-4'>
          <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as 'all' | 'in-house' | 'seller')}>
            <TabsList className='grid w-full grid-cols-3 max-w-[400px]'>
              <TabsTrigger value='all'>{t('tabs.all', 'Hamısı')}</TabsTrigger>
              <TabsTrigger value='in-house'>{t('tabs.inHouse', 'In-House')}</TabsTrigger>
              <TabsTrigger value='seller'>{t('tabs.seller', 'Satıcılar')}</TabsTrigger>
            </TabsList>
          </Tabs>

          <ProductFilterBar
            search={search}
            onSearchChange={setSearch}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            sortBy={sortBy}
            onSortByChange={setSortBy}
          />

          <ProductsTable
            products={filteredProducts}
            loading={isLoading}
            onToggleStatus={(id, field, value) => toggleStatus({ id, field, value })}
            onEditStock={setStockProduct}
            onDelete={(id) => deleteProduct(id)}
          />
        </div>

        <ProductStockDialog
          key={stockProduct ? stockProduct.id : 'closed'}
          product={stockProduct}
          open={!!stockProduct}
          onOpenChange={(open) => !open && setStockProduct(null)}
          onSave={handleStockSave}
        />
      </Main>
    </>
  )
}

export default WholesaleList
