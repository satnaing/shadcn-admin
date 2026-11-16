import { Minus, Plus, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useCurrencyFormatter } from '@/shared/hooks/useCurrencyFormatter'
import type { PosCartLine } from '../data/pos.type'

interface Props {
  line: PosCartLine
  onQuantity: (stockId: number, quantity: number) => void
  onRemove: (stockId: number) => void
}

export function PosCartLineRow({ line, onQuantity, onRemove }: Props) {
  const { t } = useTranslation('pos')
  const { formatMoney } = useCurrencyFormatter()
  const { stock, quantity } = line
  const step = (delta: number) =>
    quantity + delta < stock.min_qty ? onRemove(stock.id) : onQuantity(stock.id, quantity + delta)

  return (
    <li className='flex items-center gap-2 py-2'>
      <div className='min-w-0 flex-1'>
        <p className='truncate text-sm font-medium'>{stock.name}</p>
        <p className='text-xs text-muted-foreground'>
          {[stock.variant, formatMoney(stock.price)].filter(Boolean).join(' · ')}
        </p>
      </div>
      {stock.digital ? (
        <span className='w-24 text-center text-sm'>1</span>
      ) : (
        <div className='flex items-center gap-1'>
          <Button type='button' size='icon' variant='outline' className='size-7' aria-label={t('cart.decrease')} onClick={() => step(-1)}>
            <Minus className='size-3' />
          </Button>
          <Input
            type='number'
            min={stock.min_qty}
            max={stock.stock_qty}
            value={quantity}
            aria-label={t('cart.quantity')}
            className='h-7 w-14 px-1 text-center'
            onChange={(e) => onQuantity(stock.id, Number(e.target.value))}
          />
          <Button type='button' size='icon' variant='outline' className='size-7' aria-label={t('cart.increase')} onClick={() => step(1)}>
            <Plus className='size-3' />
          </Button>
        </div>
      )}
      <span className='w-20 text-end text-sm font-semibold'>{formatMoney(stock.price * quantity)}</span>
      <Button type='button' size='icon' variant='ghost' className='size-7' aria-label={t('cart.remove')} onClick={() => onRemove(stock.id)}>
        <Trash2 className='size-4' />
      </Button>
    </li>
  )
}
