import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Route } from '@/routes/_authenticated/inventory/stock/route'
import { type ShopIngredient } from '@/types/inventory'
import {
  useShopStock,
  useActivateShopIngredients,
} from '@/hooks/queries/use-inventory'
import { useAppStore } from '@/hooks/use-app-store'
import { BrandLoader } from '@/components/ui/brand-loader'
import { Button } from '@/components/ui/button'
import { PageTitle } from '@/components/page-title'
import { InventorySheet } from './_components/inventory-sheet'
import { InventoryTable } from './_components/inventory-table'
import { StockAdjustmentSheet } from './_components/stock-adjustment-sheet'

export default function Inventory() {
  const { page, limit } = Route.useSearch()
  const navigate = useNavigate({ from: Route.fullPath })
  const [open, setOpen] = useState(false)
  const [adjustmentOpen, setAdjustmentOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<ShopIngredient | null>(null)
  const { activeShopId: shopId } = useAppStore()

  const { data: shopData, isLoading } = useShopStock(shopId || '', {
    page,
    limit,
  })
  const { mutate: activateIngredients, isPending: isActivating } =
    useActivateShopIngredients()

  const handleAdjust = (item: ShopIngredient) => {
    setSelectedItem(item)
    setAdjustmentOpen(true)
  }

  const handleEdit = (item: ShopIngredient) => {
    setSelectedItem(item)
    setOpen(true)
  }

  const onPaginationChange = (pagination: {
    pageIndex: number
    pageSize: number
  }) => {
    navigate({
      search: (old: Record<string, unknown>) => ({
        ...old,
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
      }),
    })
  }

  return (
    <div className='p-6'>
      <div className='mb-6 flex items-center justify-between'>
        <PageTitle
          title='Stock Levels'
          subtitle={`Manage stock levels for ${shopId || 'all shops'}.`}
        />
        <div className='flex items-center gap-2'>
          {shopId && (
            <Button
              onClick={() => activateIngredients(shopId)}
              disabled={isActivating}
            >
              {isActivating ? 'Syncing...' : 'Sync'}
            </Button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className='flex justify-center p-8'>
          <BrandLoader />
        </div>
      ) : (
        <InventoryTable
          data={shopData?.data || []}
          onAdjust={handleAdjust}
          onEdit={handleEdit}
          pageCount={shopData?.meta?.totalPages}
          pagination={{
            pageIndex: page - 1,
            pageSize: limit,
          }}
          onPaginationChange={onPaginationChange}
        />
      )}

      <InventorySheet
        open={open}
        onOpenChange={(val) => {
          setOpen(val)
          if (!val) setSelectedItem(null)
        }}
        item={selectedItem}
      />

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
