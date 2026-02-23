import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { useActiveCarts } from '@/hooks/queries/use-carts'
import { useAppStore } from '@/hooks/use-app-store'
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

  return (
    <div className='flex h-full flex-col space-y-6 p-8'>
      <PageTitle
        title='Active Carts'
        subtitle='Monitor customer carts in real-time. View items and potential order value.'
      />

      {isLoading ? (
        <div className='flex flex-1 items-center justify-center'>
          <Loader2 className='h-8 w-8 animate-spin text-primary' />
        </div>
      ) : (
        <ActiveCartsTable
          data={carts || []}
          onViewDetails={handleViewDetails}
        />
      )}

      <CartDetailSheet
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        cart={selectedCart}
      />
    </div>
  )
}
