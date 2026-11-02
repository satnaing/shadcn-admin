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
import type { DynamicPopup } from '../data/marketing.type'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData?: DynamicPopup | null
  onSubmit: (data: Partial<DynamicPopup>) => void
}

function PopupFormContent({
  initialData,
  onSubmit,
  onClose,
}: {
  initialData?: DynamicPopup | null
  onSubmit: (data: Partial<DynamicPopup>) => void
  onClose: () => void
}) {
  const [title, setTitle] = useState(initialData?.title ?? '')
  const [triggerType, setTriggerType] = useState<DynamicPopup['trigger_type']>(
    initialData?.trigger_type ?? 'on_load'
  )
  const [triggerValue, setTriggerValue] = useState(initialData?.trigger_value ?? 5)
  const [actionUrl, setActionUrl] = useState(initialData?.action_url ?? '')
  const [content, setContent] = useState(initialData?.content ?? '')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      id: initialData?.id,
      title,
      trigger_type: triggerType,
      trigger_value: Number(triggerValue),
      action_url: actionUrl,
      content,
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

      <div className='grid grid-cols-2 gap-4'>
        <div className='space-y-1.5'>
          <Label>Tətikləyici Tip</Label>
          <Select
            value={triggerType}
            onValueChange={(v) => setTriggerType(v as DynamicPopup['trigger_type'])}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='on_load'>Səhifə yüklənəndə</SelectItem>
              <SelectItem value='delay'>Gecikmə ilə (saniyə)</SelectItem>
              <SelectItem value='scroll'>Səhifə sürüşdürməsi (%)</SelectItem>
              <SelectItem value='exit_intent'>Çıxış niyyətində</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className='space-y-1.5'>
          <Label>Tətikləyici Dəyər</Label>
          <Input
            type='number'
            value={triggerValue}
            onChange={(e) => setTriggerValue(Number(e.target.value))}
            disabled={triggerType === 'on_load' || triggerType === 'exit_intent'}
          />
        </div>
      </div>

      <div className='space-y-1.5'>
        <Label>Hədəf Link (URL)</Label>
        <Input
          value={actionUrl}
          onChange={(e) => setActionUrl(e.target.value)}
          placeholder='https://...'
        />
      </div>

      <div className='space-y-1.5'>
        <Label>Məzmun və ya HTML</Label>
        <Textarea
          rows={3}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder='Pop-up məzmunu...'
        />
      </div>

      <DialogFooter>
        <Button type='button' variant='outline' onClick={onClose}>
          Ləğv et
        </Button>
        <Button type='submit'>Yadda saxla</Button>
      </DialogFooter>
    </form>
  )
}

export function PopupDialog({ open, onOpenChange, initialData, onSubmit }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader>
          <DialogTitle>{initialData ? 'Pop-up Redaktəsi' : 'Yeni Dinamik Pop-up'}</DialogTitle>
        </DialogHeader>
        <PopupFormContent
          key={initialData?.id ?? 'new'}
          initialData={initialData}
          onSubmit={onSubmit}
          onClose={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
