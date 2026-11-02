import { getRouteApi } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { AdminCardShell } from '@/components/admin/admin-card-shell'
import { AdminPageShell } from '@/components/admin/admin-page-shell'
import { PermissionDialogs } from './components/permission-dialogs'
import { PermissionPrimaryButtons } from './components/permission-primary-buttons'
import { PermissionProvider } from './components/permission-provider'
import { PermissionTable } from './components/permission-table'
import { usePermissions } from './hooks/usePermissions'

const route = getRouteApi('/_authenticated/admin/permission/')

export function PermissionPage() {
  const { t } = useTranslation('permission')
  const search = route.useSearch()
  const navigate = route.useNavigate()
  const { data: permissions } = usePermissions(
    search.sort ?? 'id',
    search.order ?? 'desc'
  )

  return (
    <PermissionProvider>
      <AdminPageShell
        title={t('list.title')}
        description={t('list.description')}
        actions={<PermissionPrimaryButtons />}
      >
        <AdminCardShell>
          <PermissionTable
            data={permissions?.data ?? []}
            search={search}
            navigate={navigate}
          />
        </AdminCardShell>
      </AdminPageShell>
      <PermissionDialogs />
    </PermissionProvider>
  )
}
