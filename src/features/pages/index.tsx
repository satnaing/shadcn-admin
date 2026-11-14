import { useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { AdminPageShell } from '@/components/admin/admin-page-shell'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { Button } from '@/components/ui/button'
import type { NavigateFn } from '@/hooks/use-table-url-state'
import { toServerListParams } from '@/shared/utils/list-query-string'
import type { PageRow } from './data/pages.type'
import { usePageMutations } from './hooks/usePageMutations'
import { usePagesQuery } from './hooks/usePages'
import { PageCreateDialog } from './components/page-create-dialog'
import { PageRevisionsDrawer } from './components/page-revisions-drawer'
import { PageSettingsDrawer } from './components/page-settings-drawer'
import { PagesTable } from './components/pages-table'

export { PageBuilder } from './components/builder/builder-shell'

interface PagesPageProps {
  search: Record<string, unknown>
  navigate: NavigateFn
}

export function PagesPage({ search, navigate }: PagesPageProps) {
  const { t } = useTranslation('pages')
  const { remove } = usePageMutations()
  const [creating, setCreating] = useState(false)
  const [settingsId, setSettingsId] = useState<number | null>(null)
  const [revisionsId, setRevisionsId] = useState<number | null>(null)
  const [deleting, setDeleting] = useState<PageRow | null>(null)

  const list = usePagesQuery(
    toServerListParams(search, { defaultSort: 'updated_at', filters: ['status', 'lang'] })
  )

  const handlers = useMemo(
    () => ({
      onSettings: (page: PageRow) => setSettingsId(page.id),
      onRevisions: (page: PageRow) => setRevisionsId(page.id),
      onDelete: setDeleting,
    }),
    []
  )

  return (
    <AdminPageShell
      title={t('list.title')}
      description={t('list.description')}
      actions={
        <Button onClick={() => setCreating(true)}>
          <Plus className='me-2 size-4' />
          {t('list.create')}
        </Button>
      }
    >
      <PagesTable
        rows={list.data?.data ?? []}
        meta={list.data?.meta}
        search={search}
        navigate={navigate}
        handlers={handlers}
      />
      <PageCreateDialog open={creating} onOpenChange={setCreating} />
      <PageSettingsDrawer pageId={settingsId} onClose={() => setSettingsId(null)} />
      <PageRevisionsDrawer pageId={revisionsId} onClose={() => setRevisionsId(null)} />
      <ConfirmDialog
        open={deleting !== null}
        onOpenChange={(open) => !open && setDeleting(null)}
        title={t('delete.title')}
        desc={t('delete.description', { title: deleting?.title })}
        confirmText={t('actions.delete')}
        cancelBtnText={t('actions.cancel')}
        destructive
        isLoading={remove.isPending}
        handleConfirm={() => deleting && remove.mutate(deleting.id, { onSuccess: () => setDeleting(null) })}
      />
    </AdminPageShell>
  )
}
