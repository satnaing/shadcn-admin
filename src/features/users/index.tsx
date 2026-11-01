import { getRouteApi } from '@tanstack/react-router'
import { useListSearchParams } from '@/shared/filters/status-filter'
import type { MetaInterface } from '@/shared/types'
import {
  createCrudTabChangeHandler,
  resolveListTrashTab,
} from '@/shared/utils/crud-page'
import { LayersIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { TabsContent } from '@/components/ui/tabs'
import { AdminPageShell } from '@/components/admin/admin-page-shell'
import { CrudTabsLayout } from '@/components/admin/crud-tabs-layout'
import { UsersDialogs } from './components/users-dialogs'
import { UsersPrimaryButtons } from './components/users-primary-buttons'
import { UsersProvider } from './components/users-provider'
import { UsersTable } from './components/users-table'
import { useUsers } from './hooks/useUsers'

const route = getRouteApi('/_authenticated/users/')

export function Users() {
  const { t } = useTranslation('users')
  const search = route.useSearch()
  const navigate = route.useNavigate()

  const { page, pageSize, sort, order, status } = useListSearchParams(search)

  const { data: users } = useUsers(page, pageSize, sort, order, status)

  return (
    <UsersProvider>
      <AdminPageShell
        title={t('list.title')}
        description={t('list.description')}
        actions={!search.filter ? <UsersPrimaryButtons /> : undefined}
      >
        <CrudTabsLayout
          defaultTab={resolveListTrashTab(search.filter)}
          tabs={[
            {
              value: 'list',
              label: t('tabs.users'),
              icon: <LayersIcon />,
            },
          ]}
          onTabChange={createCrudTabChangeHandler(navigate)}
        >
          <TabsContent value='list' className='space-y-4'>
            <UsersTable
              data={users?.data ?? []}
              meta={users?.meta as MetaInterface}
              search={search}
              navigate={navigate}
            />
          </TabsContent>
        </CrudTabsLayout>
      </AdminPageShell>
      <UsersDialogs />
    </UsersProvider>
  )
}
