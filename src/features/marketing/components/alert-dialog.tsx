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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import type { CustomAlert } from '../data/marketing.type'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData?: CustomAlert | null
  onSubmit: (data: Partial<CustomAlert>) => void
}

function AlertFormContent({
  initialData,
  onSubmit,
  onClose,
}: {
  initialData?: CustomAlert | null
  onSubmit: (data: Partial<CustomAlert>) => void
  onClose: () => void
}) {
  const [title, setTitle] = useState(initialData?.title ?? '')
  const [message, setMessage] = useState(initialData?.message ?? '')
  const [type, setType] = useState<CustomAlert['type']>(initialData?.type ?? 'info')
  const [position, setPosition] = useState<CustomAlert['position']>(initialData?.position ?? 'top_banner')
  const [linkUrl, setLinkUrl] = useState(initialData?.link_url ?? '')
  const [linkText, setLinkText] = useState(initialData?.link_text ?? '')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      id: initialData?.id,
      title,
      message,
      type,
      position,
      link_url: linkUrl,
      link_text: linkText,
      status: initialData ? initialData.status : true,
    })
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <div className='space-y-1.5'>
        <Label>Başlıq</Label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>

      <div className='space-y-1.5'>
        <Label>Mesaj</Label>
        <Textarea
          rows={2}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />
      </div>

      <div className='grid grid-cols-2 gap-4'>
        <div className='space-y-1.5'>
          <Label>Xəbərdarlıq Tipi</Label>
          <Select value={type} onValueChange={(v) => setType(v as CustomAlert['type'])}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value='info'>Məlumat (Göy)</SelectItem>
              <SelectItem value='warning'>Xəbərdarlıq (Sarı)</SelectItem>
              <SelectItem value='success'>Uğurlu (Yaşıl)</SelectItem>
              <SelectItem value='danger'>Təcili (Qırmızı)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className='space-y-1.5'>
          <Label>Görünüş Mövqeyi</Label>
          <Select value={position} onValueChange={(v) => setPosition(v as CustomAlert['position'])}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value='top_banner'>Üst Başlıq Zolağı</SelectItem>
              <SelectItem value='bottom_banner'>Aşağı Sabit Zolaq</SelectItem>
              <SelectItem value='floating'>Küncdə Üzən Kart</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className='grid grid-cols-2 gap-4'>
        <div className='space-y-1.5'>
          <Label>Düymə Mətni</Label>
          <Input value={linkText} onChange={(e) => setLinkText(e.target.value)} placeholder='İndi Bax' />
        </div>
        <div className='space-y-1.5'>
          <Label>Keçid Linki</Label>
          <Input value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} placeholder='https://...' />
        </div>
      </div>

      <DialogFooter>
        <Button type='button' variant='outline' onClick={onClose}>Ləğv et</Button>
        <Button type='submit'>Yadda saxla</Button>
      </DialogFooter>
    </form>
  )
}

export function AlertDialog({ open, onOpenChange, initialData, onSubmit }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader>
          <DialogTitle>{initialData ? 'Bildiriş Banneri Redaktəsi' : 'Yeni Bildiriş Banneri'}</DialogTitle>
        </DialogHeader>
        <AlertFormContent
          key={initialData?.id ?? 'new'}
          initialData={initialData}
          onSubmit={onSubmit}
          onClose={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
