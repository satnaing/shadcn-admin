import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { payloadSummary } from '../data/preview-summary'
import { usePageQuery } from '../hooks/usePages'

interface PagePreviewProps {
  pageId: number
  lang: string
}

/** Mock preview: labelled blocks per section. shortcut: replaced by the real front `?preview=<token>` page (Q-B1). */
export function PagePreview({ pageId, lang }: PagePreviewProps) {
  const { t } = useTranslation('pages')
  const { data, isLoading, isError } = usePageQuery(pageId)
  const page = data?.data

  if (isLoading) return <Skeleton className='m-6 h-48' />
  if (isError || !page) return <p className='p-6 text-destructive'>{t('builder.notFound')}</p>

  return (
    <main className='mx-auto max-w-3xl space-y-3 p-6'>
      <h1 className='text-2xl font-semibold'>{page.title[lang] || page.title.az}</h1>
      {page.sections.length === 0 && <p className='text-muted-foreground'>{t('canvas.empty')}</p>}
      {page.sections.map((section) => (
        <section key={section.id} className={`rounded-lg border border-dashed p-4 ${section.hidden ? 'opacity-40' : ''}`}>
          <div className='mb-1 flex items-center gap-2'>
            <span className='text-xs font-medium uppercase tracking-wide text-muted-foreground'>{section.component}</span>
            {section.hidden && <Badge variant='outline'>{t('preview.hidden')}</Badge>}
          </div>
          {payloadSummary(section.payload, lang).map((line) => (
            <p key={line} className='text-sm'>{line}</p>
          ))}
        </section>
      ))}
    </main>
  )
}
