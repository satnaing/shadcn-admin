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
import { Switch } from '@/components/ui/switch'
import { type SellerPackageItem } from '../data/sellers.type'

interface SellerPackageFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData: SellerPackageItem | null
  onSave: (payload: Partial<SellerPackageItem>) => void
}

function PackageFormContent({
  initialData,
  onCancel,
  onSave,
}: {
  initialData: SellerPackageItem | null
  onCancel: () => void
  onSave: (payload: Partial<SellerPackageItem>) => void
}) {
  const { t } = useTranslation('sellers')
  const [name, setName] = useState(initialData?.name ?? '')
  const [amount, setAmount] = useState(initialData ? String(initialData.amount) : '0')
  const [productLimit, setProductLimit] = useState(
    initialData ? String(initialData.product_upload_limit) : '50'
  )
  const [durationDays, setDurationDays] = useState(
    initialData ? String(initialData.duration_days) : '30'
  )
  const [status, setStatus] = useState(initialData?.status ?? true)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      id: initialData?.id,
      name,
      amount: Number(amount) || 0,
      product_upload_limit: Number(productLimit) || 0,
      duration_days: Number(durationDays) || 30,
      status,
    })
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-3 py-2'>
      <div className='grid gap-1.5'>
        <Label htmlFor='pkg-name'>{t('packages.name', 'Paket Adı')}</Label>
        <Input id='pkg-name' required value={name} onChange={(e) => setName(e.target.value)} />
      </div>

      <div className='grid grid-cols-2 gap-3'>
        <div className='grid gap-1.5'>
          <Label htmlFor='pkg-amount'>{t('packages.price', 'Qiymət (₼)')}</Label>
          <Input
            id='pkg-amount'
            type='number'
            step='0.01'
            required
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <div className='grid gap-1.5'>
          <Label htmlFor='pkg-limit'>{t('packages.limit', 'Məhsul Limiti')}</Label>
          <Input
            id='pkg-limit'
            type='number'
            required
            value={productLimit}
            onChange={(e) => setProductLimit(e.target.value)}
          />
        </div>
      </div>

      <div className='grid gap-1.5'>
        <Label htmlFor='pkg-days'>{t('packages.durationDays', 'Müddət (Günlərlə)')}</Label>
        <Input
          id='pkg-days'
          type='number'
          required
          value={durationDays}
          onChange={(e) => setDurationDays(e.target.value)}
        />
      </div>

      <div className='flex items-center justify-between rounded-lg border p-2.5'>
        <Label htmlFor='pkg-status' className='cursor-pointer'>{t('status.active', 'Aktiv Status')}</Label>
        <Switch id='pkg-status' checked={status} onCheckedChange={setStatus} />
      </div>

      <DialogFooter className='pt-2'>
        <Button variant='outline' type='button' onClick={onCancel}>
          {t('dialog.cancel', 'Ləğv et')}
        </Button>
        <Button type='submit'>{t('dialog.save', 'Yadda saxla')}</Button>
      </DialogFooter>
    </form>
  )
}

export function SellerPackageFormDialog({
  open,
  onOpenChange,
  initialData,
  onSave,
}: SellerPackageFormDialogProps) {
  const { t } = useTranslation('sellers')

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[420px]'>
        <DialogHeader>
          <DialogTitle>
            {initialData
              ? t('packages.editTitle', 'Paketi Redaktə Et')
              : t('packages.createTitle', 'Yeni Satıcı Paketi')}
          </DialogTitle>
        </DialogHeader>

        {open && (
          <PackageFormContent
            key={initialData?.id ?? 'new'}
            initialData={initialData}
            onCancel={() => onOpenChange(false)}
            onSave={(payload) => {
              onSave(payload)
              onOpenChange(false)
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
