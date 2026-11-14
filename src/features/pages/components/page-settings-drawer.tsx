import { useTranslation } from 'react-i18next'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { usePageMutations } from '../hooks/usePageMutations'
import { usePageQuery } from '../hooks/usePages'
import { PageSettingsForm } from './page-settings-form'

interface PageSettingsDrawerProps {
  pageId: number | null
  onClose: () => void
}

export function PageSettingsDrawer({ pageId, onClose }: PageSettingsDrawerProps) {
  const { t } = useTranslation('pages')
  const { update } = usePageMutations()
  const page = usePageQuery(pageId ?? 0)
  const detail = pageId !== null ? page.data?.data : undefined

  return (
    <Sheet open={pageId !== null} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className='w-full sm:max-w-lg'>
        <SheetHeader>
          <SheetTitle>{t('settings.title')}</SheetTitle>
          <SheetDescription>{t('settings.description')}</SheetDescription>
        </SheetHeader>
        {detail ? (
          <PageSettingsForm
            key={detail.id}
            page={detail}
            pending={update.isPending}
            onSubmit={(payload) => update.mutate({ id: detail.id, payload }, { onSuccess: onClose })}
          />
        ) : null}
      </SheetContent>
    </Sheet>
  )
}
