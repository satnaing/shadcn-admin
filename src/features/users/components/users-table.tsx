import type { MetaInterface } from '@/shared/types'
import { useTranslation } from 'react-i18next'
import { type NavigateFn } from '@/hooks/use-table-url-state'
import { EntityDataTable } from '@/components/data-table/entity-data-table'
import type { UserInterface } from '../data/users.type'
import { DataTableBulkActions } from './data-table-bulk-actions'
import { usersColumns } from './users-columns'

type DataTableProps = {
  data: UserInterface[]
  search: Record<string, unknown>
  navigate: NavigateFn
  meta: MetaInterface
}

export function UsersTable({ data, search, navigate, meta }: DataTableProps) {
  const { t } = useTranslation('users')

  return (
    <EntityDataTable
      data={data}
      meta={meta}
      search={search}
      navigate={navigate}
      columns={usersColumns}
      searchPlaceholder={t('list.filterPlaceholder')}
      noResultsMessage={t('list.noResults')}
      BulkActions={DataTableBulkActions}
    />
  )
}
