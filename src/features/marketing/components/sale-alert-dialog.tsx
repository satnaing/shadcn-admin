import { useState } from 'react'
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
import type { SaleAlert } from '../data/marketing.type'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData?: SaleAlert | null
  onSubmit: (data: Partial<SaleAlert>) => void
}

function SaleAlertFormContent({
  initialData,
  onSubmit,
  onClose,
}: {
  initialData?: SaleAlert | null
  onSubmit: (data: Partial<SaleAlert>) => void
  onClose: () => void
}) {
  const [productName, setProductName] = useState(initialData?.product_name ?? '')
  const [location, setLocation] = useState(initialData?.location ?? '')
  const [timeAgo, setTimeAgo] = useState(initialData?.time_ago ?? 'İndicə alındı')
  const [productImage, setProductImage] = useState(
    initialData?.product_image ?? 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100'
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      id: initialData?.id,
      product_name: productName,
      location,
      time_ago: timeAgo,
      product_image: productImage,
      status: initialData ? initialData.status : true,
    })
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <div className='space-y-1.5'>
        <Label>Məhsul Adı</Label>
        <Input value={productName} onChange={(e) => setProductName(e.target.value)} required />
      </div>

      <div className='grid grid-cols-2 gap-4'>
        <div className='space-y-1.5'>
          <Label>Məkan (Şəhər / Rayon)</Label>
          <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder='Bakı, Nəsimi' required />
        </div>
        <div className='space-y-1.5'>
          <Label>Vaxt Mətni</Label>
          <Input value={timeAgo} onChange={(e) => setTimeAgo(e.target.value)} placeholder='5 dəqiqə əvvəl' required />
        </div>
      </div>

      <div className='space-y-1.5'>
        <Label>Məhsul Şəkli (URL)</Label>
        <Input value={productImage} onChange={(e) => setProductImage(e.target.value)} />
      </div>

      <DialogFooter>
        <Button type='button' variant='outline' onClick={onClose}>Ləğv et</Button>
        <Button type='submit'>Yadda saxla</Button>
      </DialogFooter>
    </form>
  )
}

export function SaleAlertDialog({ open, onOpenChange, initialData, onSubmit }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>{initialData ? 'Satış Bildirişi Redaktəsi' : 'Yeni Satış Bildirişi'}</DialogTitle>
        </DialogHeader>
        <SaleAlertFormContent
          key={initialData?.id ?? 'new'}
          initialData={initialData}
          onSubmit={onSubmit}
          onClose={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
