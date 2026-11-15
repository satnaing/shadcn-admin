import { createFileRoute } from '@tanstack/react-router'
import { QrCodeDetailPage, QrRouteGuard } from '@/features/qrcode-event'
import { PERMISSIONS } from '@/shared/permissions'

export const Route = createFileRoute('/_authenticated/admin/qrcode-event/codes/$id')({
  component: function Page() {
    const { id } = Route.useParams()

    return (
      <QrRouteGuard permission={PERMISSIONS.QRCODE_EVENT.CODES}>
        <QrCodeDetailPage id={id} />
      </QrRouteGuard>
    )
  },
})
