import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { PageDetail, SectionCatalogItem } from '../../data/pages.type'
import { LayerTree } from './layer-tree'
import { SectionPalette } from './section-palette'

interface BuilderLeftPanelProps {
  catalog: SectionCatalogItem[]
  page: PageDetail
  onOpenSettings: () => void
  onOpenRevisions: () => void
}

export function BuilderLeftPanel({ catalog, page, onOpenSettings, onOpenRevisions }: BuilderLeftPanelProps) {
  const { t } = useTranslation('pages')

  return (
    <aside className='flex w-72 shrink-0 flex-col border-e bg-background'>
      <Tabs defaultValue='sections' className='flex min-h-0 flex-1 flex-col'>
        <TabsList className='m-3 grid grid-cols-3'>
          <TabsTrigger value='sections'>{t('left.sections')}</TabsTrigger>
          <TabsTrigger value='layers'>{t('left.layers')}</TabsTrigger>
          <TabsTrigger value='page'>{t('left.page')}</TabsTrigger>
        </TabsList>
        <ScrollArea className='min-h-0 flex-1'>
          <div className='p-3 pt-0'>
            <TabsContent value='sections'><SectionPalette catalog={catalog} /></TabsContent>
            <TabsContent value='layers'><LayerTree catalog={catalog} /></TabsContent>
            <TabsContent value='page' className='space-y-3 text-sm'>
              <div>
                <div className='font-medium'>{page.title.az}</div>
                <div className='text-muted-foreground'>/{page.slug.az}</div>
              </div>
              <Button className='w-full' variant='outline' onClick={onOpenSettings}>{t('actions.settings')}</Button>
              <Button className='w-full' variant='outline' onClick={onOpenRevisions}>{t('actions.revisions')}</Button>
            </TabsContent>
          </div>
        </ScrollArea>
      </Tabs>
    </aside>
  )
}
