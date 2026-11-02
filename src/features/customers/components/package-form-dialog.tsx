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
import { type CustomerPackageItem } from '../data/customers.type'

interface PackageFormProps {
  pkg: Partial<CustomerPackageItem> | null
  onSave: (data: Partial<CustomerPackageItem>) => void
  onClose: () => void
}

function PackageForm({ pkg, onSave, onClose }: PackageFormProps) {
  const { t } = useTranslation('customers')
  const [name, setName] = useState(pkg?.name ?? '')
  const [amount, setAmount] = useState(pkg?.amount ? String(pkg.amount) : '0')
  const [productUpload, setProductUpload] = useState(
    pkg?.product_upload ? String(pkg.product_upload) : '10'
  )
  const [status, setStatus] = useState(pkg?.status ?? true)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      id: pkg?.id,
      name,
      amount: Number(amount),
      product_upload: Number(productUpload),
      status,
    })
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-4 py-2'>
      <div className='grid gap-2'>
        <Label htmlFor='pkg-name'>{t('packages.name', 'Paket Adı')}</Label>
        <Input
          id='pkg-name'
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className='grid grid-cols-2 gap-4'>
        <div className='grid gap-2'>
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

        <div className='grid gap-2'>
          <Label htmlFor='pkg-limit'>{t('packages.uploadLimit', 'Elan Limiti')}</Label>
          <Input
            id='pkg-limit'
            type='number'
            required
            value={productUpload}
            onChange={(e) => setProductUpload(e.target.value)}
          />
        </div>
      </div>

      <div className='flex items-center justify-between rounded-lg border p-3'>
        <Label htmlFor='pkg-status' className='cursor-pointer'>
          {t('active', 'Aktiv')}
        </Label>
        <Switch id='pkg-status' checked={status} onCheckedChange={setStatus} />
      </div>

      <DialogFooter className='pt-2'>
        <Button variant='outline' type='button' onClick={onClose}>
          {t('cancel', 'Ləğv et')}
        </Button>
        <Button type='submit'>{t('save', 'Yadda saxla')}</Button>
      </DialogFooter>
    </form>
  )
}

interface PackageFormDialogProps {
  pkg: Partial<CustomerPackageItem> | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (data: Partial<CustomerPackageItem>) => void
}

export function PackageFormDialog({
  pkg,
  open,
  onOpenChange,
  onSave,
}: PackageFormDialogProps) {
  const { t } = useTranslation('customers')

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[420px]'>
        <DialogHeader>
          <DialogTitle>
            {pkg?.id ? t('packages.editTitle', 'Paketi Redaktə Et') : t('packages.createTitle', 'Yeni Paket Yarat')}
          </DialogTitle>
        </DialogHeader>
        <PackageForm
          key={pkg?.id ? String(pkg.id) : 'new'}
          pkg={pkg}
          onSave={onSave}
          onClose={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
