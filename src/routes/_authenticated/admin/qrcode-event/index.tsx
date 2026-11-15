import { createFileRoute } from '@tanstack/react-router'
import { QrStatsPage, QrRouteGuard } from '@/features/qrcode-event'
import { PERMISSIONS } from '@/shared/permissions'

export const Route = createFileRoute('/_authenticated/admin/qrcode-event/')({
  component: function Page() {

    return (
      <QrRouteGuard permission={PERMISSIONS.QRCODE_EVENT.INDEX}>
        <QrStatsPage />
      </QrRouteGuard>
    )
  },
})
