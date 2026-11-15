import { createFileRoute } from '@tanstack/react-router'
import { QrPrizesPage, QrRouteGuard } from '@/features/qrcode-event'
import { PERMISSIONS } from '@/shared/permissions'

export const Route = createFileRoute('/_authenticated/admin/qrcode-event/campaigns/$id/prizes')({
  component: function Page() {
    const { id } = Route.useParams()

    return (
      <QrRouteGuard permission={PERMISSIONS.QRCODE_EVENT.CAMPAIGNS_MANAGE}>
        <QrPrizesPage campaignId={id} />
      </QrRouteGuard>
    )
  },
})
