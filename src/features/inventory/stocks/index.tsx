import { useState } from 'react'
import { type ShopIngredient } from '@/types/inventory'
import {
  useShopStock,
  useActivateShopIngredients,
} from '@/hooks/queries/use-inventory'
import { useAppStore } from '@/hooks/use-app-store'
import { BrandLoader } from '@/components/ui/brand-loader'
import { Button } from '@/components/ui/button'
import { PageTitle } from '@/components/page-title'
import { InventoryTable } from './_components/inventory-table'
import { StockAdjustmentSheet } from './_components/stock-adjustment-sheet'

export default function Inventory() {
  // const [open, setOpen] = useState(false)
  const [adjustmentOpen, setAdjustmentOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<ShopIngredient | null>(null)
  const { activeShopId: shopId } = useAppStore()

  const { data: shopData, isLoading } = useShopStock(shopId || '')
  const { mutate: activateIngredients, isPending: isActivating } =
    useActivateShopIngredients()

  const handleAdjust = (item: ShopIngredient) => {
    setSelectedItem(item)
    setAdjustmentOpen(true)
  }

  return (
    <div className='p-6'>
      <div className='mb-6 flex items-center justify-between'>
        <PageTitle
          title='Stock Levels'
          subtitle={`Manage stock levels for ${shopId || 'all shops'}.`}
        />
        {shopId && (
          <Button
            onClick={() => activateIngredients(shopId)}
            disabled={isActivating}
          >
            {isActivating ? 'Activating...' : 'Activate Ingredients'}
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className='flex justify-center p-8'>
          <BrandLoader />
        </div>
      ) : (
        <InventoryTable data={shopData || []} onAdjust={handleAdjust} />
      )}

      {/* <InventorySheet open={open} onOpenChange={setOpen} /> */}

      <StockAdjustmentSheet
        open={adjustmentOpen}
        onOpenChange={(val) => {
          setAdjustmentOpen(val)
          if (!val) setSelectedItem(null)
        }}
        item={selectedItem}
        shopId={shopId || ''}
      />
    </div>
  )
}
