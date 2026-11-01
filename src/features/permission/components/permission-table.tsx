import { useTranslation } from 'react-i18next'
import { type NavigateFn } from '@/hooks/use-table-url-state'
import { EntityDataTable } from '@/components/data-table/entity-data-table'
import type { PermissionEntityInterface } from '../data/permission.type'
import { permissionColumns } from './permission-columns'

type DataTableProps = {
  data: PermissionEntityInterface[]
  search: Record<string, unknown>
  navigate: NavigateFn
}

export function PermissionTable({ data, search, navigate }: DataTableProps) {
  const { t } = useTranslation('permission')

  return (
    <EntityDataTable
      data={data}
      search={search}
      navigate={navigate}
      columns={permissionColumns}
      searchPlaceholder={t('list.filterPermissions')}
      noResultsMessage={t('list.noResults')}
      enableRowSelection={false}
    />
  )
}
