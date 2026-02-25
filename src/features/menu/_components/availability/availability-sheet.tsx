import { useState, useEffect } from 'react'
import { useShopStore } from '@/stores/shop-store'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Switch } from '@/components/ui/switch'
import {
  type Product,
  type ProductAvailability,
} from '@/features/menu/data/schema'

interface AvailabilitySheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: Product | null
  initialAvailability: ProductAvailability[]
}

export function AvailabilitySheet({
  open,
  onOpenChange,
  product,
  initialAvailability,
}: AvailabilitySheetProps) {
  const shops = useShopStore((state) => state.shops)
  const [availabilities, setAvailabilities] = useState<ProductAvailability[]>(
    []
  )

  useEffect(() => {
    if (product) {
      // Find existing or create default availability for each shop
      const current = shops.map((shop) => {
        const found = initialAvailability.find(
          (a) => a.productId === product.id && a.shopId === shop.id
        )
        return (
          found || {
            shopId: shop.id,
            productId: product.id!,
            isAvailable: false,
            priceOverride: null,
          }
        )
      })
      setAvailabilities(current)
    }
  }, [product, shops, initialAvailability])

  const handleToggle = (shopId: string, checked: boolean) => {
    setAvailabilities((prev) =>
      prev.map((a) =>
        a.shopId === shopId ? { ...a, isAvailable: checked } : a
      )
    )
  }

  const handlePriceChange = (shopId: string, value: string) => {
    const numValue = value === '' ? null : parseFloat(value)
    setAvailabilities((prev) =>
      prev.map((a) =>
        a.shopId === shopId ? { ...a, priceOverride: numValue } : a
      )
    )
  }

  const handleSave = () => {
    console.log('Saving availability:', availabilities)
    alert(`Updated availability for ${product?.name.en}`)
    onOpenChange(false)
  }

  if (!product) return null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className='w-full p-4 sm:max-w-xl'>
        <SheetHeader>
          <SheetTitle>Manage Availability</SheetTitle>
          <SheetDescription>
            Configure where <strong>{product.name.en}</strong> is sold and set
            custom prices.
            <br />
            Base Price: ${(product.price as any).toFixed(2)}
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className='mt-6 h-[70vh] pr-4'>
          <div className='space-y-6'>
            {shops.map((shop) => {
              const availability = availabilities.find(
                (a) => a.shopId === shop.id
              ) || {
                shopId: shop.id,
                productId: product.id!,
                isAvailable: false,
                priceOverride: null,
              }

              return (
                <div
                  key={shop.id}
                  className='flex flex-col gap-3 rounded-lg border p-4'
                >
                  <div className='flex items-center justify-between'>
                    <div className='flex flex-col'>
                      <span className='font-semibold'>{shop.name}</span>
                      <span className='text-xs text-muted-foreground'>
                        ID: {shop.id}
                      </span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <Label
                        htmlFor={`avail-${shop.id}`}
                        className={
                          availability.isAvailable
                            ? ''
                            : 'text-muted-foreground'
                        }
                      >
                        {availability.isAvailable ? 'Active' : 'Inactive'}
                      </Label>
                      <Switch
                        id={`avail-${shop.id}`}
                        checked={availability.isAvailable}
                        onCheckedChange={(c) => handleToggle(shop.id, c)}
                      />
                    </div>
                  </div>

                  {availability.isAvailable && (
                    <div className='mt-2 flex items-center gap-4'>
                      <div className='flex-1'>
                        <Label className='text-xs text-muted-foreground'>
                          Price Strategy
                        </Label>
                        <div className='mt-1 flex items-center gap-2'>
                          <Badge variant='outline' className='h-9 font-normal'>
                            {availability.priceOverride
                              ? 'Custom Price'
                              : 'Standard Price'}
                          </Badge>
                        </div>
                      </div>
                      <div className='w-[150px]'>
                        <Label htmlFor={`price-${shop.id}`} className='text-xs'>
                          Override Price ($)
                        </Label>
                        <Input
                          id={`price-${shop.id}`}
                          type='number'
                          placeholder={(product.price as any).toFixed(2)}
                          value={availability.priceOverride ?? ''}
                          onChange={(e) =>
                            handlePriceChange(shop.id, e.target.value)
                          }
                          className='mt-1'
                        />
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </ScrollArea>

        <SheetFooter className='mt-6'>
          <Button onClick={handleSave} className='w-full'>
            Save Configuration
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
