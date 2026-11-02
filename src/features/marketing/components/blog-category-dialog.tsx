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
import type { BlogCategory } from '../data/marketing.type'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData?: BlogCategory | null
  onSubmit: (data: Partial<BlogCategory>) => void
}

function CategoryFormContent({
  initialData,
  onSubmit,
  onClose,
}: {
  initialData?: BlogCategory | null
  onSubmit: (data: Partial<BlogCategory>) => void
  onClose: () => void
}) {
  const [name, setName] = useState(initialData?.name ?? '')
  const [slug, setSlug] = useState(initialData?.slug ?? '')

  const handleNameChange = (val: string) => {
    setName(val)
    if (!initialData) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '')
      )
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      id: initialData?.id,
      name,
      slug,
      status: initialData ? initialData.status : true,
    })
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <div className='space-y-1.5'>
        <Label>Kateqoriya Adı</Label>
        <Input value={name} onChange={(e) => handleNameChange(e.target.value)} required />
      </div>

      <div className='space-y-1.5'>
        <Label>Slug</Label>
        <Input value={slug} onChange={(e) => setSlug(e.target.value)} required />
      </div>

      <DialogFooter>
        <Button type='button' variant='outline' onClick={onClose}>Ləğv et</Button>
        <Button type='submit'>Yadda saxla</Button>
      </DialogFooter>
    </form>
  )
}

export function BlogCategoryDialog({ open, onOpenChange, initialData, onSubmit }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>{initialData ? 'Kateqoriya Redaktəsi' : 'Yeni Bloq Kateqoriyası'}</DialogTitle>
        </DialogHeader>
        <CategoryFormContent
          key={initialData?.id ?? 'new'}
          initialData={initialData}
          onSubmit={onSubmit}
          onClose={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
