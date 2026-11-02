import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
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
import { Textarea } from '@/components/ui/textarea'
import type { EmailTemplate } from '../data/marketing.type'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  template?: EmailTemplate | null
  onSubmit: (data: Partial<EmailTemplate>) => void
}

function EmailTemplateFormContent({
  template,
  onSubmit,
  onClose,
}: {
  template?: EmailTemplate | null
  onSubmit: (data: Partial<EmailTemplate>) => void
  onClose: () => void
}) {
  const [subject, setSubject] = useState(template?.subject ?? '')
  const [body, setBody] = useState(template?.body ?? '')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!template) return
    onSubmit({ id: template.id, subject, body, status: template.status })
    onClose()
  }

  const insertVariable = (variable: string) => {
    setBody((prev) => `${prev} ${variable}`)
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <div className='space-y-1.5'>
        <Label>Şablon Adı</Label>
        <Input value={template?.name ?? ''} disabled className='bg-muted' />
      </div>

      <div className='space-y-1.5'>
        <Label>Mövzu (Subject)</Label>
        <Input value={subject} onChange={(e) => setSubject(e.target.value)} required />
      </div>

      {template?.variables && template.variables.length > 0 && (
        <div className='space-y-1.5'>
          <Label className='text-xs text-muted-foreground'>İstifadə Oluna Bilən Dəyişənlər:</Label>
          <div className='flex flex-wrap gap-1.5'>
            {template.variables.map((v) => (
              <Badge
                key={v}
                variant='outline'
                className='cursor-pointer hover:bg-muted font-mono text-xs'
                onClick={() => insertVariable(v)}
              >
                {v}
              </Badge>
            ))}
          </div>
        </div>
      )}

      <div className='space-y-1.5'>
        <Label>E-poçt Məzmunu (HTML / Mətn)</Label>
        <Textarea rows={8} value={body} onChange={(e) => setBody(e.target.value)} required />
      </div>

      <DialogFooter>
        <Button type='button' variant='outline' onClick={onClose}>Ləğv et</Button>
        <Button type='submit'>Yadda saxla</Button>
      </DialogFooter>
    </form>
  )
}

export function EmailTemplateDialog({ open, onOpenChange, template, onSubmit }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-2xl'>
        <DialogHeader>
          <DialogTitle>E-poçt Şablonunu Redaktə Et</DialogTitle>
        </DialogHeader>
        <EmailTemplateFormContent
          key={template?.id ?? 'none'}
          template={template}
          onSubmit={onSubmit}
          onClose={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
