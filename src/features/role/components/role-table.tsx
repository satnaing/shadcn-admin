import { useTranslation } from 'react-i18next'
import { EntityDataTable } from '@/components/data-table'
import type { NavigateFn } from '@/hooks/use-table-url-state'
import type { MetaInterface } from '@/shared/types'
import type { Role } from '../data/role.type'
import { useRoleColumns } from './role-columns'

interface RoleTableProps {
  roles: Role[]
  meta?: MetaInterface
  search: Record<string, unknown>
  navigate: NavigateFn
  onEdit: (role: Role) => void
  onDelete: (role: Role) => void
}

export function RoleTable({ roles, meta, search, navigate, onEdit, onDelete }: RoleTableProps) {
  const { t } = useTranslation('roles')
  const columns = useRoleColumns(onEdit, onDelete)

  return (
    <EntityDataTable
      data={roles}
      meta={meta}
      search={search}
      navigate={navigate}
      columns={columns}
      searchPlaceholder={t('list.search')}
      noResultsMessage={t('list.empty')}
      enableRowSelection={false}
      enableStatusFilter={false}
      defaultSort='name'
    />
  )
}
