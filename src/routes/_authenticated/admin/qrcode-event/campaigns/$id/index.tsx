import { createFileRoute } from '@tanstack/react-router'
import { QrCampaignEditPage, QrRouteGuard } from '@/features/qrcode-event'
import { PERMISSIONS } from '@/shared/permissions'

export const Route = createFileRoute('/_authenticated/admin/qrcode-event/campaigns/$id/')({
  component: function Page() {
    const { id } = Route.useParams()

    return (
      <QrRouteGuard permission={PERMISSIONS.QRCODE_EVENT.CAMPAIGNS_MANAGE}>
        <QrCampaignEditPage id={id} />
      </QrRouteGuard>
    )
  },
})
