import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { slugify } from '../data/slugify'
import { usePageMutations } from '../hooks/usePageMutations'
import { usePageTemplatesQuery } from '../hooks/usePages'

interface PageCreateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PageCreateDialog({ open, onOpenChange }: PageCreateDialogProps) {
  const { t } = useTranslation('pages')
  const { create } = usePageMutations()
  const templates = usePageTemplatesQuery(open).data?.data ?? []
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [slugTouched, setSlugTouched] = useState(false)
  const [templateId, setTemplateId] = useState<number | null>(null)

  const reset = () => {
    setTitle('')
    setSlug('')
    setSlugTouched(false)
    setTemplateId(null)
  }

  const submit = () =>
    create.mutate(
      { title: title.trim(), slug: slug || slugify(title), template_id: templateId },
      {
        onSuccess: () => {
          reset()
          onOpenChange(false)
        },
      }
    )

  const choices = [{ id: null, name: t('create.blank'), description: t('create.blankHint') }, ...templates]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-xl'>
        <DialogHeader className='text-start'>
          <DialogTitle>{t('create.title')}</DialogTitle>
          <DialogDescription>{t('create.description')}</DialogDescription>
        </DialogHeader>
        <div className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='page-title'>{t('fields.title')}</Label>
            <Input
              id='page-title'
              value={title}
              onChange={(e) => {
                setTitle(e.target.value)
                if (!slugTouched) setSlug(slugify(e.target.value))
              }}
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='page-slug'>{t('fields.slug')}</Label>
            <Input
              id='page-slug'
              value={slug}
              onChange={(e) => {
                setSlugTouched(true)
                setSlug(slugify(e.target.value))
              }}
            />
          </div>
          <fieldset className='space-y-2'>
            <legend className='text-sm font-medium'>{t('create.template')}</legend>
            <div className='grid gap-2 sm:grid-cols-3'>
              {choices.map((choice) => (
                <button
                  key={choice.id ?? 'blank'}
                  type='button'
                  aria-pressed={templateId === choice.id}
                  onClick={() => setTemplateId(choice.id)}
                  className={cn(
                    'rounded-md border p-3 text-start text-sm transition-colors hover:bg-accent',
                    templateId === choice.id && 'border-primary bg-accent'
                  )}
                >
                  <span className='block font-medium'>{choice.name}</span>
                  <span className='text-xs text-muted-foreground'>{choice.description}</span>
                </button>
              ))}
            </div>
          </fieldset>
        </div>
        <DialogFooter>
          <Button disabled={!title.trim() || create.isPending} onClick={submit}>
            {t('create.submit')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
