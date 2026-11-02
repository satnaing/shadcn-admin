import type { MetaInterface } from '@/shared/types'
import { useTranslation } from 'react-i18next'
import { type NavigateFn } from '@/hooks/use-table-url-state'
import { EntityTrashDataTable } from '@/components/data-table/entity-trash-data-table'
import type { UserInterface } from '../data/users.type'
import { trashUsersColumns } from './users-trash-columns'

type DataTableProps = {
  data: UserInterface[]
  search: Record<string, unknown>
  navigate: NavigateFn
  meta: MetaInterface
}

export function TrashUsersTable({
  data,
  search,
  navigate,
  meta,
}: DataTableProps) {
  const { t } = useTranslation('users')

  return (
    <EntityTrashDataTable
      data={data}
      meta={meta}
      search={search}
      navigate={navigate}
      columns={trashUsersColumns}
      searchPlaceholder={t('list.filterPlaceholder')}
      noResultsMessage={t('list.noResults')}
    />
  )
}
