import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { AdminPageShell } from '@/components/admin/admin-page-shell'
import { PermissionGuard } from '@/components/guard'
import { Button } from '@/components/ui/button'
import type { NavigateFn } from '@/hooks/use-table-url-state'
import { PERMISSIONS } from '@/shared/permissions'
import { RefundReasonDialog } from './refund-reason-dialog'
import { RefundReasonsTable } from './refund-reasons-table'

interface Props {
  search: Record<string, unknown>
  navigate: NavigateFn
}

/** Preset reasons: what customers pick when asking for a refund, and what admins pick when rejecting one. */
export function RefundReasonsPage({ search, navigate }: Props) {
  const { t } = useTranslation('refund')
  const [creating, setCreating] = useState(false)

  return (
    <AdminPageShell
      title={t('reasons.title')}
      description={t('reasons.description')}
      actions={
        <PermissionGuard permission={PERMISSIONS.REFUND.REASONS_MANAGE}>
          <Button onClick={() => setCreating(true)}>
            <Plus className='me-2 size-4' />
            {t('reasons.new')}
          </Button>
        </PermissionGuard>
      }
    >
      <RefundReasonsTable search={search} navigate={navigate} />
      {creating && <RefundReasonDialog open onOpenChange={(open) => !open && setCreating(false)} />}
    </AdminPageShell>
  )
}
