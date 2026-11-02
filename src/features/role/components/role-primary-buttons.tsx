import { PERMISSIONS } from '@/shared/constant'
import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { PermissionGuard } from '@/components/guard/permission-guard'
import { useRoleContext } from './role-provider'

export function RolePrimaryButtons() {
  const { t } = useTranslation('role')
  const { setOpen } = useRoleContext()
  return (
    <div className='flex gap-2'>
      <PermissionGuard permission={PERMISSIONS.ROLES.CREATE}>
        <Button className='space-x-1' onClick={() => setOpen('add')}>
          <span>{t('primaryButtons.addRole')}</span> <Plus size={18} />
        </Button>
      </PermissionGuard>
    </div>
  )
}
