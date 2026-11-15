import { createFileRoute } from '@tanstack/react-router'
import { QrSettingsPage, QrRouteGuard } from '@/features/qrcode-event'
import { PERMISSIONS } from '@/shared/permissions'

export const Route = createFileRoute('/_authenticated/admin/qrcode-event/settings')({
  component: function Page() {

    return (
      <QrRouteGuard permission={PERMISSIONS.QRCODE_EVENT.SETTINGS}>
        <QrSettingsPage />
      </QrRouteGuard>
    )
  },
})
