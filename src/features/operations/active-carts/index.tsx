import { useState } from 'react'
import { useActiveCarts } from '@/hooks/queries/use-carts'
import { useAppStore } from '@/hooks/use-app-store'
import { BrandLoader } from '@/components/ui/brand-loader'
import { PageTitle } from '@/components/page-title'
import { ActiveCartsTable } from '../_components/active-carts-table'
import { CartDetailSheet } from '../_components/cart-detail-sheet'
import { type Cart } from '../data/cart-schema'

export function ActiveCartsPage() {
  const { activeShopId } = useAppStore()
  const { data: carts, isLoading } = useActiveCarts(activeShopId)
  const [selectedCart, setSelectedCart] = useState<Cart | null>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  const handleViewDetails = (cart: Cart) => {
    setSelectedCart(cart)
    setIsSheetOpen(true)
  }

  if (isLoading) {
    return (
      <div className='flex h-[80vh] w-full items-center justify-center p-6'>
        <BrandLoader />
      </div>
    )
  }

  return (
    <div className='flex h-full flex-col space-y-6 p-8'>
      <PageTitle
        title='Active Carts'
        subtitle='Monitor customer carts in real-time. View items and potential order value.'
      />

      <ActiveCartsTable data={carts || []} onViewDetails={handleViewDetails} />

      <CartDetailSheet
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        cart={selectedCart}
      />
    </div>
  )
}
