import { PERMISSIONS } from '@/shared/constant'
import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { PermissionGuard } from '@/components/guard/permission-guard'
import { usePermissionContext } from './permission-provider'

export function PermissionPrimaryButtons() {
  const { t } = useTranslation('permission')
  const { setOpen } = usePermissionContext()
  return (
    <div className='flex gap-2'>
      <PermissionGuard permission={PERMISSIONS.PERMISSIONS.CREATE}>
        <Button className='space-x-1' onClick={() => setOpen('add')}>
          <span>{t('primaryButtons.addPermission')}</span> <Plus size={18} />
        </Button>
      </PermissionGuard>
    </div>
  )
}
