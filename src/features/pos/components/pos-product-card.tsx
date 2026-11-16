import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/badge'
import { useCurrencyFormatter } from '@/shared/hooks/useCurrencyFormatter'
import type { PosStockItem } from '../data/pos.type'

interface Props {
  stock: PosStockItem
  onAdd: (stock: PosStockItem) => void
}

/** One variant of a product; clicking adds it to the cart. Out-of-stock physical items are disabled. */
export function PosProductCard({ stock, onAdd }: Props) {
  const { t } = useTranslation('pos')
  const { formatMoney } = useCurrencyFormatter()
  const soldOut = !stock.digital && stock.stock_qty <= 0

  return (
    <button
      type='button'
      disabled={soldOut}
      onClick={() => onAdd(stock)}
      className='flex flex-col gap-1 rounded-lg border bg-card p-3 text-start transition hover:border-primary disabled:cursor-not-allowed disabled:opacity-50'
    >
      <span className='line-clamp-2 text-sm font-medium'>{stock.name}</span>
      {stock.variant && <span className='text-xs text-muted-foreground'>{stock.variant}</span>}
      <span className='mt-auto flex items-center justify-between gap-2 pt-2'>
        <span className='text-sm font-semibold'>{formatMoney(stock.price)}</span>
        <Badge variant={soldOut ? 'destructive' : 'secondary'}>
          {soldOut ? t('grid.outOfStock') : t('grid.inStock', { count: stock.stock_qty })}
        </Badge>
      </span>
    </button>
  )
}
