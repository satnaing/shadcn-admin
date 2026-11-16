import { useCallback, useMemo, useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { PERMISSIONS } from '@/shared/permissions'
import { toServerListParams } from '@/shared/utils/list-query-string'
import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { NavigateFn } from '@/hooks/use-table-url-state'
import { Button } from '@/components/ui/button'
import { AdminPageShell } from '@/components/admin/admin-page-shell'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { EntityDataTable } from '@/components/data-table'
import { translatedColumnHeader } from '@/components/data-table/column-header'
import { PermissionGuard } from '@/components/guard'
import type { FaqItem } from '../data/preorder.type'
import { useFaqs } from '../hooks/use-preorder'
import { usePreorderMutations } from '../hooks/use-preorder-mutations'
import { PreorderFaqDialog } from './preorder-faq-dialog'
import { FlagSwitch } from './preorder-flag-switch'
import { PreorderRowButtons } from './preorder-row-buttons'

const h = (key: string) =>
  translatedColumnHeader<FaqItem, unknown>(`preorder:faqs.columns.${key}`)
const MANAGE = PERMISSIONS.PREORDER.FAQS_MANAGE

interface Props {
  search: Record<string, unknown>
  navigate: NavigateFn
}

/** Questions shown on the storefront "how to preorder" page. */
export function PreorderFaqsPage({ search, navigate }: Props) {
  const { t } = useTranslation('preorder')
  const [editing, setEditing] = useState<FaqItem | 'new' | null>(null)
  const [removing, setRemoving] = useState<FaqItem | null>(null)
  const { setFaqActive, removeFaq } = usePreorderMutations()
  const { data } = useFaqs(toServerListParams(search))
  const onToggle = useCallback(
    (f: FaqItem, value: boolean) => setFaqActive.mutate({ id: f.id, value }),
    [setFaqActive]
  )
  const columns = useMemo<ColumnDef<FaqItem>[]>(
    () => [
      {
        accessorKey: 'question',
        ...h('question'),
        cell: ({ row }) => (
          <span className='line-clamp-2 max-w-md font-medium'>
            {row.original.question}
          </span>
        ),
      },
      {
        accessorKey: 'answer',
        enableSorting: false,
        ...h('answer'),
        cell: ({ row }) => (
          <span className='line-clamp-2 max-w-md text-muted-foreground'>
            {row.original.answer}
          </span>
        ),
      },
      {
        id: 'is_active',
        enableSorting: false,
        ...h('status'),
        cell: ({ row }) => (
          <FlagSwitch
            permission={MANAGE}
            checked={row.original.is_active}
            label={t('faqs.columns.status')}
            onChange={(v) => onToggle(row.original, v)}
          />
        ),
      },
      {
        id: 'actions',
        enableSorting: false,
        enableHiding: false,
        header: () => null,
        cell: ({ row }) => (
          <PreorderRowButtons
            permission={MANAGE}
            onEdit={() => setEditing(row.original)}
            onDelete={() => setRemoving(row.original)}
          />
        ),
      },
    ],
    [onToggle, t]
  )

  return (
    <AdminPageShell
      title={t('faqs.title')}
      description={t('faqs.description')}
      actions={
        <PermissionGuard permission={MANAGE}>
          <Button onClick={() => setEditing('new')}>
            <Plus className='me-2 size-4' />
            {t('faqs.new')}
          </Button>
        </PermissionGuard>
      }
    >
      <EntityDataTable
        data={data?.data ?? []}
        meta={data?.meta}
        search={search}
        navigate={navigate}
        columns={columns}
        searchPlaceholder={t('faqs.search')}
        noResultsMessage={t('faqs.empty')}
        enableRowSelection={false}
        enableStatusFilter={false}
      />
      {editing && (
        <PreorderFaqDialog
          key={editing === 'new' ? 'new' : editing.id}
          open
          onOpenChange={(open) => !open && setEditing(null)}
          faq={editing === 'new' ? undefined : editing}
        />
      )}
      <ConfirmDialog
        open={!!removing}
        onOpenChange={(open) => !open && setRemoving(null)}
        title={t('faqs.deleteTitle')}
        desc={t('faqs.deleteDesc', { name: removing?.question })}
        confirmText={t('actions.delete')}
        destructive
        isLoading={removeFaq.isPending}
        handleConfirm={() =>
          removing &&
          removeFaq.mutate(removing.id, { onSettled: () => setRemoving(null) })
        }
      />
    </AdminPageShell>
  )
}
