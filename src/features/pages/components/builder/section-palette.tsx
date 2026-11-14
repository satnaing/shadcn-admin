import { useMemo, useState } from 'react'
import { useDraggable } from '@dnd-kit/core'
import { GripVertical } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Input } from '@/components/ui/input'
import { useBuilderStore } from '../../data/builder.store'
import { PALETTE_PREFIX, newSectionOf } from '../../data/new-section'
import type { SectionCatalogItem } from '../../data/pages.type'


function PaletteCard({ item }: { item: SectionCatalogItem }) {
  const add = useBuilderStore((s) => s.add)
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: `${PALETTE_PREFIX}${item.component}` })

  return (
    <div
      ref={setNodeRef}
      className={`flex items-center gap-2 rounded-md border p-2 text-sm ${isDragging ? 'opacity-50' : ''}`}
    >
      <button type='button' aria-label={item.title} className='cursor-grab touch-none' {...attributes} {...listeners}>
        <GripVertical className='size-4 text-muted-foreground' />
      </button>
      <button type='button' className='min-w-0 flex-1 text-start' onClick={() => add(newSectionOf(item))}>
        <span className='block truncate font-medium'>{item.title}</span>
        <span className='block truncate text-xs text-muted-foreground'>{item.component}</span>
      </button>
    </div>
  )
}

export function SectionPalette({ catalog }: { catalog: SectionCatalogItem[] }) {
  const { t } = useTranslation('pages')
  const [query, setQuery] = useState('')

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase()
    const hits = catalog.filter((c) => !q || `${c.title} ${c.component}`.toLowerCase().includes(q))
    const byCategory = new Map<string, SectionCatalogItem[]>()
    for (const item of hits) byCategory.set(item.category, [...(byCategory.get(item.category) ?? []), item])
    return [...byCategory.entries()]
  }, [catalog, query])

  return (
    <div className='space-y-3'>
      <Input aria-label={t('palette.search')} placeholder={t('palette.search')} value={query} onChange={(e) => setQuery(e.target.value)} />
      {groups.length === 0 ? <p className='text-sm text-muted-foreground'>{t('palette.empty')}</p> : null}
      {groups.map(([category, items]) => (
        <section key={category} className='space-y-2'>
          <h3 className='text-xs font-semibold uppercase text-muted-foreground'>{category}</h3>
          {items.map((item) => <PaletteCard key={item.component} item={item} />)}
        </section>
      ))}
    </div>
  )
}
