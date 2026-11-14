import { useEffect, useRef, useState } from 'react'
import { useDroppable } from '@dnd-kit/core'
import { ArrowDown, ArrowUp, Copy, Eye, EyeOff, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { type Device, useBuilderStore } from '../../data/builder.store'
import { readText } from '../../data/payload-schema'
import { PREVIEW_DOC } from '../../data/preview-doc'
import type { PageSection, SectionCatalogItem } from '../../data/pages.type'

export const CANVAS_DROP_ID = 'canvas'
const WIDTH: Record<Device, string> = { desktop: 'w-full', tablet: 'w-[768px]', mobile: 'w-[375px]' }

const summaryOf = (section: PageSection, lang: string) => {
  const title = section.payload.title ?? section.payload.headline
  return readText(title, lang)
}

function SelectionToolbar({ index }: { index: number }) {
  const { t } = useTranslation('pages')
  const section = useBuilderStore((s) => s.sections[index])
  const { move, duplicate, toggleHidden, remove } = useBuilderStore.getState()
  if (!section) return null

  return (
    <div role='toolbar' aria-label={t('canvas.toolbar')} className='absolute end-4 top-4 z-10 flex gap-1 rounded-md border bg-background p-1 shadow'>
      <Button size='icon' variant='ghost' className='size-7' aria-label={t('actions.up')} onClick={() => move(index, index - 1)}><ArrowUp className='size-4' /></Button>
      <Button size='icon' variant='ghost' className='size-7' aria-label={t('actions.down')} onClick={() => move(index, index + 1)}><ArrowDown className='size-4' /></Button>
      <Button size='icon' variant='ghost' className='size-7' aria-label={t('actions.duplicate')} onClick={() => duplicate(section.id)}><Copy className='size-4' /></Button>
      <Button size='icon' variant='ghost' className='size-7' aria-label={t('actions.toggleHidden')} onClick={() => toggleHidden(section.id)}>
        {section.hidden ? <EyeOff className='size-4' /> : <Eye className='size-4' />}
      </Button>
      <Button size='icon' variant='ghost' className='size-7' aria-label={t('actions.delete')} onClick={() => remove(section.id)}><Trash2 className='size-4' /></Button>
    </div>
  )
}

export function CanvasFrame({ catalog }: { catalog: SectionCatalogItem[] }) {
  const { t } = useTranslation('pages')
  const frame = useRef<HTMLIFrameElement>(null)
  const [ready, setReady] = useState(false)
  const { sections, selectedId, lang, device, select } = useBuilderStore()
  const { setNodeRef, isOver } = useDroppable({ id: CANVAS_DROP_ID })
  const selectedIndex = sections.findIndex((s) => s.id === selectedId)

  useEffect(() => {
    const onMessage = (event: MessageEvent<{ type?: string; id?: string }>) => {
      if (event.source !== frame.current?.contentWindow) return
      if (event.data?.type === 'ready') setReady(true)
      if (event.data?.type === 'select' && typeof event.data.id === 'string') select(event.data.id)
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [select])

  useEffect(() => {
    if (!ready) return
    const cards = sections.map((section) => {
      const item = catalog.find((c) => c.component === section.component)
      return {
        id: section.id,
        hidden: section.hidden,
        missing: !item,
        category: item?.category ?? '?',
        title: item?.title ?? section.component,
        summary: summaryOf(section, lang),
      }
    })
    frame.current?.contentWindow?.postMessage({ type: 'sections', sections: cards, selectedId, emptyText: t('canvas.empty') }, '*')
  }, [ready, sections, selectedId, lang, catalog, t])

  return (
    <div ref={setNodeRef} className={cn('relative flex min-w-0 flex-1 justify-center overflow-auto bg-muted/40 p-4', isOver && 'ring-2 ring-primary ring-inset')}>
      {selectedIndex >= 0 ? <SelectionToolbar index={selectedIndex} /> : null}
      <iframe
        ref={frame}
        title={t('canvas.title')}
        sandbox='allow-scripts'
        srcDoc={PREVIEW_DOC}
        className={cn('h-full min-h-[480px] max-w-full rounded-md border bg-white shadow-sm transition-[width]', WIDTH[device])}
      />
    </div>
  )
}
