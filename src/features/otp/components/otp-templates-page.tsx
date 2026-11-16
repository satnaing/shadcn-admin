import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AdminPageShell } from '@/components/admin/admin-page-shell'
import { EntityDataTable } from '@/components/data-table'
import type { NavigateFn } from '@/hooks/use-table-url-state'
import { toServerListParams } from '@/shared/utils/list-query-string'
import type { TemplateItem } from '../data/otp.type'
import { useOtpTemplates } from '../hooks/use-otp'
import { useOtpMutations } from '../hooks/use-otp-mutations'
import { useOtpTemplateColumns } from './otp-template-columns'
import { OtpTemplateDialog } from './otp-template-dialog'

interface Props {
  search: Record<string, unknown>
  navigate: NavigateFn
}

/** SMS bodies sent for verification, orders and deliveries (AEC "SMS Templates"). */
export function OtpTemplatesPage({ search, navigate }: Props) {
  const { t } = useTranslation('otp')
  const [editing, setEditing] = useState<TemplateItem | null>(null)
  const { saveTemplate } = useOtpMutations()
  const onToggle = useCallback(
    (item: TemplateItem) => saveTemplate.mutate({ id: item.id, values: { active: !item.active } }),
    [saveTemplate]
  )
  const columns = useOtpTemplateColumns(onToggle, setEditing)
  const { data } = useOtpTemplates(toServerListParams(search, { filters: [] }))

  return (
    <AdminPageShell title={t('templates.title')} description={t('templates.description')}>
      <EntityDataTable
        data={data?.data ?? []}
        meta={data?.meta}
        search={search}
        navigate={navigate}
        columns={columns}
        searchPlaceholder={t('templates.search')}
        noResultsMessage={t('templates.empty')}
        enableRowSelection={false}
        enableStatusFilter={false}
      />
      {editing && (
        <OtpTemplateDialog key={editing.id} open onOpenChange={(open) => !open && setEditing(null)} template={editing} />
      )}
    </AdminPageShell>
  )
}
