import { useTranslation } from 'react-i18next'
import { type NavigateFn } from '@/hooks/use-table-url-state'
import { EntityDataTable } from '@/components/data-table/entity-data-table'
import type { RoleEntityInterface } from '../data/role.type'
import { roleColumns } from './role-columns'

type DataTableProps = {
  data: RoleEntityInterface[]
  search: Record<string, unknown>
  navigate: NavigateFn
}

export function RoleTable({ data, search, navigate }: DataTableProps) {
  const { t } = useTranslation('role')

  return (
    <EntityDataTable
      data={data}
      search={search}
      navigate={navigate}
      columns={roleColumns}
      searchPlaceholder={t('list.filterRoles')}
      noResultsMessage={t('list.noResults')}
    />
  )
}
