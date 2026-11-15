import { createFileRoute } from '@tanstack/react-router'
import { QrCampaignForm, QrRouteGuard } from '@/features/qrcode-event'
import { PERMISSIONS } from '@/shared/permissions'

export const Route = createFileRoute('/_authenticated/admin/qrcode-event/campaigns/new')({
  component: function Page() {

    return (
      <QrRouteGuard permission={PERMISSIONS.QRCODE_EVENT.CAMPAIGNS_MANAGE}>
        <QrCampaignForm />
      </QrRouteGuard>
    )
  },
})
