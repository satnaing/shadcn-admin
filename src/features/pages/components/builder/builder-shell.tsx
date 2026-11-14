import { useEffect, useRef, useState } from 'react'
import { type DragEndEvent, DndContext, PointerSensor, closestCenter, useSensor, useSensors } from '@dnd-kit/core'
import { useTranslation } from 'react-i18next'
import { useBuilderStore } from '../../data/builder.store'
import { useAutosave } from '../../hooks/useAutosave'
import { usePageQuery, useSectionCatalogQuery } from '../../hooks/usePages'
import { PageRevisionsDrawer } from '../page-revisions-drawer'
import { PageSettingsDrawer } from '../page-settings-drawer'
import { BuilderLeftPanel } from './builder-left-panel'
import { BuilderTopbar } from './builder-topbar'
import { CANVAS_DROP_ID, CanvasFrame } from './canvas-frame'
import { FieldPanel } from './field-panel'
import { PALETTE_PREFIX, newSectionOf } from '../../data/new-section'

export function PageBuilder({ pageId }: { pageId: number }) {
  const { t } = useTranslation('pages')
  const pageQuery = usePageQuery(pageId)
  const page = pageQuery.data?.data
  const catalog = useSectionCatalogQuery().data?.data ?? []
  const loadedFor = useRef<number | null>(null)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [revisionsOpen, setRevisionsOpen] = useState(false)
  const saveState = useAutosave(pageId)
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }))

  // Load once per page: a refetch (e.g. after saving settings) must not wipe unsaved edits.
  useEffect(() => {
    if (page && loadedFor.current !== page.id) {
      loadedFor.current = page.id
      useBuilderStore.getState().load(page.sections)
    }
  }, [page])

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over) return
    const store = useBuilderStore.getState()
    const activeId = String(active.id)
    const overId = String(over.id)
    const overIndex = store.sections.findIndex((s) => s.id === overId)

    if (activeId.startsWith(PALETTE_PREFIX)) {
      const item = catalog.find((c) => c.component === activeId.slice(PALETTE_PREFIX.length))
      if (item && (overId === CANVAS_DROP_ID || overIndex >= 0)) {
        store.add(newSectionOf(item), overIndex >= 0 ? overIndex : undefined)
      }
      return
    }
    store.move(store.sections.findIndex((s) => s.id === activeId), overIndex)
  }

  if (!page) {
    return (
      <div className='fixed inset-0 z-50 grid place-items-center bg-background text-sm text-muted-foreground'>
        {pageQuery.isError ? t('builder.notFound') : t('builder.loading')}
      </div>
    )
  }

  return (
    <div className='fixed inset-0 z-50 flex flex-col bg-background'>
      <BuilderTopbar pageId={pageId} title={page.title.az} saveState={saveState} />
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <div className='flex min-h-0 flex-1'>
          <BuilderLeftPanel
            catalog={catalog}
            page={page}
            onOpenSettings={() => setSettingsOpen(true)}
            onOpenRevisions={() => setRevisionsOpen(true)}
          />
          <CanvasFrame catalog={catalog} />
          <FieldPanel catalog={catalog} />
        </div>
      </DndContext>
      <PageSettingsDrawer pageId={settingsOpen ? pageId : null} onClose={() => setSettingsOpen(false)} />
      <PageRevisionsDrawer pageId={revisionsOpen ? pageId : null} onClose={() => {
          setRevisionsOpen(false)
          loadedFor.current = null
        }}
      />
    </div>
  )
}
