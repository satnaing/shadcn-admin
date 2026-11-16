import type { PosCartLine, PosStockItem } from './pos.type'

export type CartError = 'minStock' | 'alreadyInCart' | 'noMoreStock'
export interface CartResult {
  lines: PosCartLine[]
  error?: CartError
}

const round2 = (n: number) => Math.round(n * 100) / 100

/** Same rules as AEC `PosUtility::addToCart`, but the cart lives in the browser until the order is placed. */
export function addToCart(lines: PosCartLine[], stock: PosStockItem): CartResult {
  const line = lines.find((l) => l.stock.id === stock.id)

  if (!line) {
    if (!stock.digital && stock.stock_qty < stock.min_qty) return { lines, error: 'minStock' }
    return { lines: [...lines, { stock, quantity: stock.min_qty }] }
  }
  if (stock.digital) return { lines, error: 'alreadyInCart' }
  if (line.quantity + 1 > stock.stock_qty) return { lines, error: 'noMoreStock' }
  return { lines: lines.map((l) => (l === line ? { ...l, quantity: l.quantity + 1 } : l)) }
}

/** Quantity can neither exceed stock nor go below the product minimum. */
export function setQuantity(lines: PosCartLine[], stockId: number, quantity: number): CartResult {
  const line = lines.find((l) => l.stock.id === stockId)
  if (!line || !Number.isFinite(quantity)) return { lines }
  const { min_qty, stock_qty, digital } = line.stock
  if (!digital && quantity > stock_qty) return { lines, error: 'noMoreStock' }
  const next = Math.max(min_qty, Math.floor(quantity))
  return { lines: lines.map((l) => (l === line ? { ...l, quantity: next } : l)) }
}

export const removeLine = (lines: PosCartLine[], stockId: number) =>
  lines.filter((l) => l.stock.id !== stockId)

export interface Totals {
  subtotal: number
  tax: number
  shipping: number
  discount: number
  total: number
}

/** AEC let the discount exceed the order and produced a negative total; it is capped here. */
export function cartTotals(lines: PosCartLine[], shipping: number, discount: number): Totals {
  const subtotal = round2(lines.reduce((sum, l) => sum + l.stock.price * l.quantity, 0))
  const tax = round2(lines.reduce((sum, l) => sum + l.stock.tax * l.quantity, 0))
  const gross = subtotal + tax + shipping
  const applied = Math.min(Math.max(discount, 0), gross)
  return { subtotal, tax, shipping, discount: round2(applied), total: round2(gross - applied) }
}
