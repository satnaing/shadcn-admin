import { useState, useEffect } from 'react'
import { type ShopProduct } from '@/types/api'
import {
  useToggleProductAvailability,
  useUpdateShopPrice,
} from '@/hooks/queries/use-catalog'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'

const PriceCell = ({ row, shopId }: { row: any; shopId: string }) => {
  const item = row.original as ShopProduct
  const { mutate: updatePrice } = useUpdateShopPrice()
  const [price, setPrice] = useState(item.price || '')

  useEffect(() => {
    // Sync local state when the prop updates from server
    if (item.price !== undefined && item.price !== price) {
      setPrice(item.price)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item.price])

  const handleBlur = () => {
    if (price !== item.price) {
      updatePrice({
        shopId,
        productId: item.productId,
        price: Number(price),
      })
    }
  }

  return (
    <div className='flex items-center gap-2'>
      <Input
        type='number'
        className='h-8 w-24'
        placeholder={
          item.product?.price?.choices?.[0]?.price?.toString() || '0'
        }
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        onBlur={handleBlur}
      />
    </div>
  )
}

const AvailabilityCell = ({ row, shopId }: { row: any; shopId: string }) => {
  const item = row.original as ShopProduct
  const { mutate: toggleAvailability, isPending } =
    useToggleProductAvailability()

  return (
    <Switch
      checked={item.isAvailable}
      disabled={isPending}
      onCheckedChange={(checked) =>
        toggleAvailability({
          shopId,
          productId: item.productId,
          isAvailable: checked,
        })
      }
    />
  )
}

export { PriceCell, AvailabilityCell }
