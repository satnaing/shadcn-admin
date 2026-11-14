import { Info } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { AdminCardShell } from '@/components/admin/admin-card-shell'
import { AdminPageShell } from '@/components/admin/admin-page-shell'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import { useRoles } from '@/features/role/hooks/useRoles'
import { PermissionMatrix } from './components/permission-matrix'

export function PermissionsPage() {
  const { t } = useTranslation('roles')
  const { data, isLoading, isError } = useRoles()

  return (
    <AdminPageShell title={t('matrix.title')} description={t('matrix.description')}>
      <Alert>
        <Info className='size-4' />
        <AlertDescription>{t('matrix.note')}</AlertDescription>
      </Alert>
      <AdminCardShell>
        {isLoading && <Skeleton className='h-64 w-full' />}
        {isError && (
          <Alert variant='destructive'>
            <AlertDescription>{t('list.error')}</AlertDescription>
          </Alert>
        )}
        {data && <PermissionMatrix roles={data.data ?? []} />}
      </AdminCardShell>
    </AdminPageShell>
  )
}
