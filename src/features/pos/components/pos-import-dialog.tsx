import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useDebouncedValue } from '@/hooks/use-debounced-value'
import { usePosAvailable, usePosLookups } from '../hooks/use-pos'
import { usePosMutations } from '../hooks/use-pos-mutations'
import { PosFilterSelect } from './pos-filter-select'

/** "Import products": pick catalogue products that are not on the terminal yet and switch them on (AEC `pos-products-search` + `pos-products-update`). */
export function PosImportDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { t } = useTranslation('pos')
  const [q, setQ] = useState('')
  const [category, setCategory] = useState('all')
  const [picked, setPicked] = useState<number[]>([])
  const { setInPos } = usePosMutations()
  const lookups = usePosLookups().data?.data
  const items =
    usePosAvailable(
      {
        q: useDebouncedValue(q.trim()) || undefined,
        category: category === 'all' ? undefined : category,
        per_page: 50,
      },
      open
    ).data?.data ?? []
  const toggle = (id: number) =>
    setPicked((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]))
  const close = (next: boolean) => {
    if (!next) setPicked([])
    onOpenChange(next)
  }

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className='sm:max-w-xl'>
        <DialogHeader className='text-start'>
          <DialogTitle>{t('import.title')}</DialogTitle>
          <DialogDescription>{t('import.description')}</DialogDescription>
        </DialogHeader>
        <div className='grid gap-2 sm:grid-cols-2'>
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('grid.search')} aria-label={t('grid.search')} />
          <PosFilterSelect
            value={category}
            onChange={setCategory}
            allLabel={t('grid.allCategories')}
            options={(lookups?.categories ?? []).map((c) => ({ value: String(c.id), label: `${'— '.repeat(c.depth)}${c.name}` }))}
          />
        </div>
        <ul className='max-h-72 divide-y overflow-y-auto rounded-md border'>
          {items.length === 0 && <li className='p-3 text-sm text-muted-foreground'>{t('import.empty')}</li>}
          {items.map((p) => (
            <li key={p.id} className='flex items-center gap-3 p-2 text-sm'>
              <Checkbox checked={picked.includes(p.id)} onCheckedChange={() => toggle(p.id)} aria-label={p.name} />
              <span className='flex-1'>{p.name}</span>
              <span className='text-muted-foreground'>{p.category}</span>
            </li>
          ))}
        </ul>
        <DialogFooter>
          <Button
            disabled={picked.length === 0 || setInPos.isPending}
            onClick={() => setInPos.mutate({ ids: picked, pos: true }, { onSuccess: () => close(false) })}
          >
            {t('import.add', { count: picked.length })}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
