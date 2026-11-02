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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { type SellerItem } from '../data/sellers.type'

interface SellerPayDialogProps {
  seller: SellerItem | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onPay: (id: number, amount: number, method: string, note?: string) => void
}

export function SellerPayDialog({
  seller,
  open,
  onOpenChange,
  onPay,
}: SellerPayDialogProps) {
  const { t } = useTranslation('sellers')
  const [amount, setAmount] = useState('')
  const [method, setMethod] = useState('bank_transfer')
  const [note, setNote] = useState('')

  if (!seller) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const numericAmount = Number(amount)
    if (numericAmount > 0) {
      onPay(seller.id, numericAmount, method, note)
      onOpenChange(false)
      setAmount('')
      setNote('')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[420px]'>
        <DialogHeader>
          <DialogTitle>{t('pay.title', 'Satıcıya Balans Ödənişi')}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='space-y-3 py-2'>
          <div className='rounded border p-3 bg-muted/40 text-sm'>
            <div className='font-semibold'>{seller.name}</div>
            <div className='text-xs text-muted-foreground'>
              {t('pay.currentBalance', 'Mövcud Balans')}:{' '}
              <span className='font-bold text-emerald-600 dark:text-emerald-400'>
                {seller.balance.toFixed(2)} ₼
              </span>
            </div>
          </div>

          <div className='grid gap-1.5'>
            <Label htmlFor='pay-amount'>{t('pay.amount', 'Ödəniləcək Məbləğ (₼)')}</Label>
            <Input
              id='pay-amount'
              type='number'
              step='0.01'
              max={seller.balance > 0 ? seller.balance : undefined}
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder='0.00'
            />
          </div>

          <div className='grid gap-1.5'>
            <Label>{t('pay.method', 'Ödəniş Metodu')}</Label>
            <Select value={method} onValueChange={setMethod}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value='bank_transfer'>{t('pay.bank', 'Bank Köçürməsi (Hesaba)')}</SelectItem>
                <SelectItem value='cash'>{t('pay.cash', 'Nağd')}</SelectItem>
                <SelectItem value='card'>{t('pay.card', 'Kart Ödənişi')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className='grid gap-1.5'>
            <Label htmlFor='pay-note'>{t('pay.note', 'Qeyd / Çıxarış nömrəsi')}</Label>
            <Textarea
              id='pay-note'
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={t('pay.notePlaceholder', 'Qeyd daxil edin...')}
            />
          </div>

          <DialogFooter className='pt-2'>
            <Button variant='outline' type='button' onClick={() => onOpenChange(false)}>
              {t('dialog.cancel', 'Ləğv et')}
            </Button>
            <Button type='submit'>{t('pay.confirm', 'Ödənişi Təsdiqlə')}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
