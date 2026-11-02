import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { ProductItem } from '../data/products.type'

interface ProductStockDialogProps {
  product: ProductItem | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (id: number, stock: number) => Promise<unknown>
}

export function ProductStockDialog({
  product,
  open,
  onOpenChange,
  onSave,
}: ProductStockDialogProps) {
  const { t } = useTranslation('products')
  const [stock, setStock] = useState(product?.current_stock ?? 0)
  const [saving, setSaving] = useState(false)

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!product) return
    setSaving(true)
    try {
      await onSave(product.id, Number(stock))
      onOpenChange(false)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[420px]'>
        <DialogHeader>
          <DialogTitle>{t('stockDialog.title', 'Stok Miqdarını Dəyiş')}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSave} className='space-y-4 py-2'>
          <div className='rounded-lg bg-muted/50 p-3'>
            <p className='text-xs text-muted-foreground'>{t('common.product', 'Məhsul')}</p>
            <p className='text-sm font-semibold'>{product?.name}</p>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='stock-input'>{t('stockDialog.currentStock', 'Mövcud Stok Sayı')}</Label>
            <Input
              id='stock-input'
              type='number'
              min='0'
              value={stock}
              onChange={(e) => setStock(Number(e.target.value))}
              required
            />
          </div>

          <DialogFooter className='gap-2 pt-2'>
            <Button
              type='button'
              variant='outline'
              onClick={() => onOpenChange(false)}
              disabled={saving}
            >
              {t('common.cancel', 'Ləğv et')}
            </Button>
            <Button type='submit' disabled={saving}>
              {saving ? t('common.saving', 'Yadda saxlanılır...') : t('common.save', 'Yadda saxla')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
