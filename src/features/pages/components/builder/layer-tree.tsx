import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { AlertTriangle, Copy, Eye, EyeOff, GripVertical, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { SortableItem } from '@/components/sortable-item'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useBuilderStore } from '../../data/builder.store'
import type { PageSection, SectionCatalogItem } from '../../data/pages.type'

function Layer({ section, title }: { section: PageSection; title?: string }) {
  const { t } = useTranslation('pages')
  const selected = useBuilderStore((s) => s.selectedId === section.id)
  const { select, toggleHidden, duplicate, remove } = useBuilderStore.getState()

  return (
    <SortableItem id={section.id} className={cn('flex items-center gap-1 rounded-md border bg-background p-1.5 text-sm', selected && 'border-primary bg-accent')}>
      {({ attributes, listeners }) => (
        <>
          <button type='button' aria-label={t('actions.drag')} className='cursor-grab touch-none' {...attributes} {...listeners}>
            <GripVertical className='size-4 text-muted-foreground' />
          </button>
          <button type='button' className={cn('min-w-0 flex-1 text-start', section.hidden && 'opacity-50')} onClick={() => select(section.id)}>
            <span className='block truncate'>{title ?? section.component}</span>
            {title ? null : (
              <Badge variant='destructive' className='gap-1 text-[10px]'>
                <AlertTriangle className='size-3' />
                {t('field.componentMissing')}
              </Badge>
            )}
          </button>
          <Button size='icon' variant='ghost' className='size-7' aria-label={t('actions.toggleHidden')} onClick={() => toggleHidden(section.id)}>
            {section.hidden ? <EyeOff className='size-4' /> : <Eye className='size-4' />}
          </Button>
          <Button size='icon' variant='ghost' className='size-7' aria-label={t('actions.duplicate')} onClick={() => duplicate(section.id)}>
            <Copy className='size-4' />
          </Button>
          <Button size='icon' variant='ghost' className='size-7' aria-label={t('actions.delete')} onClick={() => remove(section.id)}>
            <Trash2 className='size-4' />
          </Button>
        </>
      )}
    </SortableItem>
  )
}

export function LayerTree({ catalog }: { catalog: SectionCatalogItem[] }) {
  const { t } = useTranslation('pages')
  const sections = useBuilderStore((s) => s.sections)

  if (sections.length === 0) return <p className='text-sm text-muted-foreground'>{t('layers.empty')}</p>

  return (
    <SortableContext items={sections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
      <ul className='space-y-1.5'>
        {sections.map((section) => (
          <Layer key={section.id} section={section} title={catalog.find((c) => c.component === section.component)?.title} />
        ))}
      </ul>
    </SortableContext>
  )
}
