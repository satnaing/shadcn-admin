import { useRef, useState } from 'react'
import { FileText, Trash2, Upload } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { useDebouncedValue } from '@/hooks/use-debounced-value'
import { acceptAttr, matchesAccept, toggleFile } from './media.logic'
import type { MediaAccept, MediaRef } from './media.type'
import { useMediaList, useMediaMutations } from './use-media'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  accept: MediaAccept
  multiple: boolean
  max?: number
  initial: MediaRef[]
  onConfirm: (files: MediaRef[]) => void
}

const TYPE = { image: 'image', file: 'document', any: undefined } as const

/** Library dialog: search, upload, delete, pick (single or many). Mounted only while open, so it restarts from `initial`. */
export function MediaLibraryDialog({ open, onOpenChange, accept, multiple, max, initial, onConfirm }: Props) {
  const { t } = useTranslation('media')
  const [q, setQ] = useState('')
  const [selected, setSelected] = useState(initial)
  const input = useRef<HTMLInputElement>(null)
  const search = useDebouncedValue(q)
  const { data, isFetching } = useMediaList({ q: search, type: TYPE[accept] }, open)
  const { upload, remove } = useMediaMutations()
  const files = (data?.data ?? []).filter((f) => matchesAccept(f, accept))

  const onFile = (file?: File) => {
    if (!file) return
    upload.mutate(file, {
      onSuccess: (res) => res.data && setSelected((s) => toggleFile(s, res.data, multiple, max)),
      onError: () => toast.error(t('library.uploadFailed')),
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-3xl'>
        <DialogHeader>
          <DialogTitle>{t('library.title')}</DialogTitle>
          <DialogDescription>{t('library.description')}</DialogDescription>
        </DialogHeader>
        <div className='flex gap-2'>
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('search')} aria-label={t('search')} />
          <input
            ref={input}
            type='file'
            hidden
            accept={acceptAttr(accept)}
            onChange={(e) => {
              onFile(e.target.files?.[0])
              e.target.value = ''
            }}
          />
          <Button type='button' variant='outline' onClick={() => input.current?.click()} disabled={upload.isPending}>
            <Upload className='me-2 size-4' />
            {t('upload')}
          </Button>
        </div>
        <ul className='grid max-h-[26rem] grid-cols-3 gap-2 overflow-auto sm:grid-cols-4' aria-busy={isFetching}>
          {files.length === 0 && !isFetching && (
            <li className='col-span-full p-6 text-center text-sm text-muted-foreground'>{t('empty')}</li>
          )}
          {files.map((f) => {
            const on = selected.some((s) => s.id === f.id)
            return (
              <li key={f.id} className={cn('group relative overflow-hidden rounded-md border', on && 'ring-2 ring-primary')}>
                <button
                  type='button'
                  className='block w-full'
                  aria-pressed={on}
                  onClick={() => setSelected((s) => toggleFile(s, f, multiple, max))}
                >
                  {f.type === 'image' ? (
                    <img src={f.url} alt={f.name} loading='lazy' className='aspect-[3/2] w-full object-cover' />
                  ) : (
                    <span className='flex aspect-[3/2] items-center justify-center bg-muted'>
                      <FileText className='size-8 text-muted-foreground' />
                    </span>
                  )}
                  <span className='block truncate px-2 py-1 text-start text-xs'>{f.name}</span>
                </button>
                <Button
                  type='button'
                  size='icon'
                  variant='secondary'
                  aria-label={t('deleteConfirm.confirm')}
                  className='absolute end-1 top-1 size-7 opacity-0 group-hover:opacity-100 focus-visible:opacity-100'
                  onClick={() => {
                    remove.mutate(f.id)
                    setSelected((s) => s.filter((x) => x.id !== f.id))
                  }}
                >
                  <Trash2 className='size-3.5' />
                </Button>
              </li>
            )
          })}
        </ul>
        <DialogFooter>
          <Button type='button' variant='outline' onClick={() => onOpenChange(false)}>
            {t('deleteConfirm.cancel')}
          </Button>
          <Button
            type='button'
            onClick={() => {
              onConfirm(selected)
              onOpenChange(false)
            }}
          >
            {t('library.select', { count: selected.length })}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
