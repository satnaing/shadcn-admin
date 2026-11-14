import { AlertTriangle, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useBuilderStore } from '../../data/builder.store'
import { fieldsForTab } from '../../data/payload-schema'
import type { FieldTab, SectionCatalogItem } from '../../data/pages.type'
import { FieldInput } from './field-input'
import { RawJsonEditor } from './raw-json-editor'

const TABS: FieldTab[] = ['content', 'source', 'style']

interface FieldPanelProps {
  catalog: SectionCatalogItem[]
}

export function FieldPanel({ catalog }: FieldPanelProps) {
  const { t } = useTranslation('pages')
  const section = useBuilderStore((s) => s.sections.find((x) => x.id === s.selectedId))
  const lang = useBuilderStore((s) => s.lang)
  const select = useBuilderStore((s) => s.select)
  const patchPayload = useBuilderStore((s) => s.patchPayload)

  if (!section) return null
  const item = catalog.find((c) => c.component === section.component)
  const schema = item?.payload_schema

  return (
    <aside className='flex w-80 shrink-0 flex-col border-s bg-background' aria-label={t('field.panel')}>
      <div className='flex items-center justify-between gap-2 border-b p-3'>
        <div className='min-w-0'>
          <div className='truncate text-sm font-semibold'>{item?.title ?? section.component}</div>
          <div className='truncate text-xs text-muted-foreground'>{section.component}</div>
        </div>
        <Button size='icon' variant='ghost' aria-label={t('actions.close')} onClick={() => select(null)}>
          <X className='size-4' />
        </Button>
      </div>
      <ScrollArea className='min-h-0 flex-1'>
        <div className='p-3'>
          {!item ? (
            <Badge variant='destructive' className='gap-1'>
              <AlertTriangle className='size-3' />
              {t('field.componentMissing')}
            </Badge>
          ) : !schema ? (
            <RawJsonEditor key={section.id} sectionId={section.id} payload={section.payload} />
          ) : (
            <Tabs defaultValue='content'>
              <TabsList className='w-full'>
                {TABS.map((tab) => (
                  <TabsTrigger key={tab} value={tab}>{t(`field.tab.${tab}`)}</TabsTrigger>
                ))}
              </TabsList>
              {TABS.map((tab) => (
                <TabsContent key={tab} value={tab} className='mt-3 space-y-4'>
                  {fieldsForTab(schema, tab).map((def) => (
                    <FieldInput
                      key={`${section.id}-${def.key}`}
                      def={def}
                      lang={lang}
                      value={section.payload[def.key]}
                      onChange={(value) => patchPayload(section.id, { [def.key]: value }, `${section.id}:${def.key}:${lang}`)}
                    />
                  ))}
                </TabsContent>
              ))}
            </Tabs>
          )}
        </div>
      </ScrollArea>
    </aside>
  )
}
