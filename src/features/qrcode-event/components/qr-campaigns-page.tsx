import { Link } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { AdminPageShell } from '@/components/admin/admin-page-shell'
import { PermissionGuard } from '@/components/guard'
import { Button } from '@/components/ui/button'
import type { NavigateFn } from '@/hooks/use-table-url-state'
import { PERMISSIONS } from '@/shared/permissions'
import { QrCampaignsTable } from './qr-campaigns-table'

interface Props {
  search: Record<string, unknown>
  navigate: NavigateFn
}

export function QrCampaignsPage({ search, navigate }: Props) {
  const { t } = useTranslation('qrcode_event')

  return (
    <AdminPageShell
      title={t('campaigns.title')}
      description={t('campaigns.description')}
      actions={
        <PermissionGuard permission={PERMISSIONS.QRCODE_EVENT.CAMPAIGNS_MANAGE}>
          <Button asChild>
            <Link to='/admin/qrcode-event/campaigns/new'>
              <Plus className='me-2 size-4' />
              {t('campaigns.new')}
            </Link>
          </Button>
        </PermissionGuard>
      }
    >
      <QrCampaignsTable search={search} navigate={navigate} />
    </AdminPageShell>
  )
}
