import { useParams } from '@tanstack/react-router'
import { useShopStore } from '@/stores/shop-store'
import {
  useShopProducts,
  useCategories,
  useSyncShopCatalog,
} from '@/hooks/queries/use-catalog'
import { BrandLoader } from '@/components/ui/brand-loader'
import { Button } from '@/components/ui/button'
import { PageTitle } from '@/components/page-title'
import { ShopMenuTable } from './_components/shop-menu-table'

export default function ShopMenuPage() {
  const { id: shopId } = useParams({ strict: false }) as { id: string }
  const { data: products, isLoading } = useShopProducts(shopId)
  const { data: categories } = useCategories()
  const { shops } = useShopStore()
  const shop = shops?.find((s) => s.id === shopId)

  const { mutate: syncCatalog, isPending: isSyncing } = useSyncShopCatalog()

  if (isLoading) {
    return (
      <div className='flex h-full items-center justify-center p-6'>
        <BrandLoader />
      </div>
    )
  }

  return (
    <div className='p-6'>
      <PageTitle
        title={`${shop?.name || 'Shop'} Menu Options`}
        subtitle='Manage the menu availability and pricing for this specific branch.'
        buttonLabel='Sync Master Catalog'
        onClick={() => syncCatalog(shopId)}
      />

      <ShopMenuTable
        shopId={shopId}
        data={products || []}
        categories={categories}
      />
    </div>
  )
}
