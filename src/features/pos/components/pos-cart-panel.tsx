import { ShoppingCart } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCurrencyFormatter } from '@/shared/hooks/useCurrencyFormatter'
import type { PosCart } from '../hooks/use-pos-cart'
import { PosCartLineRow } from './pos-cart-line'

interface Props {
  cart: PosCart
  onCheckout: () => void
}

/** Lines, shipping, discount and totals; "Place order" opens the summary dialog. */
export function PosCartPanel({ cart, onCheckout }: Props) {
  const { t } = useTranslation('pos')
  const { formatMoney } = useCurrencyFormatter()
  const { totals } = cart
  const rows: [string, number][] = [
    [t('cart.subtotal'), totals.subtotal],
    [t('cart.tax'), totals.tax],
    [t('cart.shipping'), totals.shipping],
    [t('cart.discount'), -totals.discount],
  ]

  return (
    <Card>
      <CardHeader className='pb-2'>
        <CardTitle className='flex items-center gap-2 text-base'>
          <ShoppingCart className='size-4' />
          {t('cart.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        {cart.lines.length === 0 ? (
          <p className='py-6 text-center text-sm text-muted-foreground'>{t('cart.empty')}</p>
        ) : (
          <ul className='divide-y'>
            {cart.lines.map((line) => (
              <PosCartLineRow key={line.stock.id} line={line} onQuantity={cart.setQuantity} onRemove={cart.remove} />
            ))}
          </ul>
        )}
        <div className='grid grid-cols-2 gap-3'>
          <div className='space-y-1'>
            <Label htmlFor='pos-shipping'>{t('cart.shipping')}</Label>
            <Input id='pos-shipping' type='number' min={0} value={cart.shipping} onChange={(e) => cart.setShipping(Number(e.target.value))} />
          </div>
          <div className='space-y-1'>
            <Label htmlFor='pos-discount'>{t('cart.discount')}</Label>
            <Input id='pos-discount' type='number' min={0} value={cart.discount} onChange={(e) => cart.setDiscount(Number(e.target.value))} />
          </div>
        </div>
        <dl className='space-y-1 text-sm'>
          {rows.map(([label, value]) => (
            <div key={label} className='flex justify-between'>
              <dt className='text-muted-foreground'>{label}</dt>
              <dd>{formatMoney(value)}</dd>
            </div>
          ))}
          <div className='flex justify-between border-t pt-2 text-base font-semibold'>
            <dt>{t('cart.total')}</dt>
            <dd>{formatMoney(totals.total)}</dd>
          </div>
        </dl>
        <div className='flex gap-2'>
          <Button type='button' variant='outline' disabled={cart.lines.length === 0} onClick={cart.clear}>
            {t('cart.clear')}
          </Button>
          <Button type='button' className='flex-1' disabled={cart.lines.length === 0} onClick={onCheckout}>
            {t('cart.placeOrder')}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
