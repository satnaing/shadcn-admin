import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import {
  addToCart,
  type CartResult,
  cartTotals,
  removeLine,
  setQuantity,
} from '../data/pos-cart'
import type { PosCartLine, PosStockItem } from '../data/pos.type'

/** Browser-side cart (AEC kept it in the `carts` table keyed by the PHP session). Gone after a reload, like an unsent order. */
export function usePosCart() {
  const { t } = useTranslation('pos')
  const [lines, setLines] = useState<PosCartLine[]>([])
  const [shipping, setShipping] = useState(0)
  const [discount, setDiscount] = useState(0)

  const apply = ({ lines: next, error }: CartResult) => {
    setLines(next)
    if (error) toast.error(t(`cart.error.${error}`))
  }

  return {
    lines,
    shipping,
    discount,
    setShipping: (v: number) => setShipping(Math.max(0, v || 0)),
    setDiscount: (v: number) => setDiscount(Math.max(0, v || 0)),
    totals: cartTotals(lines, shipping, discount),
    add: (stock: PosStockItem) => apply(addToCart(lines, stock)),
    setQuantity: (stockId: number, qty: number) => apply(setQuantity(lines, stockId, qty)),
    remove: (stockId: number) => setLines(removeLine(lines, stockId)),
    clear: () => {
      setLines([])
      setShipping(0)
      setDiscount(0)
    },
  }
}
export type PosCart = ReturnType<typeof usePosCart>
