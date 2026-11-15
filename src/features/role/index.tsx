import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { AdminCardShell } from '@/components/admin/admin-card-shell'
import { AdminPageShell } from '@/components/admin/admin-page-shell'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { PermissionGuard } from '@/components/guard'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import type { NavigateFn } from '@/hooks/use-table-url-state'
import { toServerListParams } from '@/shared/utils/list-query-string'
import { Skeleton } from '@/components/ui/skeleton'
import { PERMISSIONS } from '@/shared/permissions'
import type { Role } from './data/role.type'
import { RoleFormDialog } from './components/role-form-dialog'
import { RoleTable } from './components/role-table'
import { useRoleMutations, useRolesPage } from './hooks/useRoles'

interface RolesPageProps {
  search: Record<string, unknown>
  navigate: NavigateFn
}

export function RolesPage({ search, navigate }: RolesPageProps) {
  const { t } = useTranslation('roles')
  const { data, isLoading, isError } = useRolesPage(toServerListParams(search, { defaultSort: 'name', defaultOrder: 'asc' }))
  const { deleteRole } = useRoleMutations()
  const [target, setTarget] = useState<Role | 'new' | null>(null)
  const [toDelete, setToDelete] = useState<Role | null>(null)

  const confirmDelete = () => {
    if (!toDelete) return
    deleteRole.mutate(toDelete.id, {
      onSuccess: () => {
        toast.success(t('form.deleted'))
        setToDelete(null)
      },
    })
  }

  return (
    <AdminPageShell
      title={t('list.title')}
      description={t('list.description')}
      actions={
        <PermissionGuard permission={PERMISSIONS.ROLES.CREATE}>
          <Button onClick={() => setTarget('new')}>
            <Plus className='size-4' /> {t('list.add')}
          </Button>
        </PermissionGuard>
      }
    >
      <AdminCardShell>
        {isLoading && <Skeleton className='h-64 w-full' />}
        {isError && (
          <Alert variant='destructive'>
            <AlertDescription>{t('list.error')}</AlertDescription>
          </Alert>
        )}
        {data && (
          <RoleTable roles={data.data ?? []} meta={data.meta} search={search} navigate={navigate} onEdit={setTarget} onDelete={setToDelete} />
        )}
      </AdminCardShell>

      <RoleFormDialog target={target} onClose={() => setTarget(null)} />
      <ConfirmDialog
        open={toDelete !== null}
        onOpenChange={(open) => !open && setToDelete(null)}
        title={t('delete.title')}
        desc={t('delete.desc', { name: toDelete?.name ?? '' })}
        confirmText={t('list.delete')}
        destructive
        isLoading={deleteRole.isPending}
        handleConfirm={confirmDelete}
      />
    </AdminPageShell>
  )
}
