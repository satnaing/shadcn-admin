import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { usePageMutations } from '../hooks/usePageMutations'
import { usePageRevisionsQuery } from '../hooks/usePages'

interface PageRevisionsDrawerProps {
  pageId: number | null
  onClose: () => void
}

export function PageRevisionsDrawer({ pageId, onClose }: PageRevisionsDrawerProps) {
  const { t } = useTranslation('pages')
  const { restore } = usePageMutations()
  const revisions = usePageRevisionsQuery(pageId ?? 0, pageId !== null).data?.data ?? []

  return (
    <Sheet open={pageId !== null} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className='w-full sm:max-w-md'>
        <SheetHeader>
          <SheetTitle>{t('revisions.title')}</SheetTitle>
          <SheetDescription>{t('revisions.description')}</SheetDescription>
        </SheetHeader>
        <ul className='flex flex-col gap-2 overflow-y-auto px-4 pb-4'>
          {revisions.length === 0 ? <li className='text-sm text-muted-foreground'>{t('revisions.empty')}</li> : null}
          {revisions.map((revision, index) => (
            <li key={revision.id} className='flex items-center justify-between gap-2 rounded-md border p-3 text-sm'>
              <div>
                <div className='font-medium'>{new Date(revision.created_at).toLocaleString()}</div>
                <div className='text-muted-foreground'>
                  {revision.author} · {t('revisions.sections', { count: revision.sections_count })}
                  {revision.note ? ` · ${revision.note}` : ''}
                </div>
              </div>
              {index === 0 ? (
                <span className='text-xs text-muted-foreground'>{t('revisions.current')}</span>
              ) : (
                <Button
                  size='sm'
                  variant='outline'
                  disabled={restore.isPending || pageId === null}
                  onClick={() => pageId !== null && restore.mutate({ id: pageId, revisionId: revision.id }, { onSuccess: onClose })}
                >
                  {t('revisions.restore')}
                </Button>
              )}
            </li>
          ))}
        </ul>
      </SheetContent>
    </Sheet>
  )
}
