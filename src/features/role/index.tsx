import { getRouteApi } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { AdminCardShell } from '@/components/admin/admin-card-shell'
import { AdminPageShell } from '@/components/admin/admin-page-shell'
import { RoleDialogs } from './components/role-dialogs'
import { RolePrimaryButtons } from './components/role-primary-buttons'
import { RoleProvider } from './components/role-provider'
import { RoleTable } from './components/role-table'
import { useRoles } from './hooks/useRoles'

const route = getRouteApi('/_authenticated/role/')

export function RolePage() {
  const { t } = useTranslation('role')
  const search = route.useSearch()
  const navigate = route.useNavigate()
  const { data: roles } = useRoles(search.sort ?? 'id', search.order ?? 'desc')

  return (
    <RoleProvider>
      <AdminPageShell
        title={t('list.title')}
        description={t('list.description')}
        actions={<RolePrimaryButtons />}
      >
        <AdminCardShell>
          <RoleTable
            data={roles?.data ?? []}
            search={search}
            navigate={navigate}
          />
        </AdminCardShell>
      </AdminPageShell>
      <RoleDialogs />
    </RoleProvider>
  )
}
