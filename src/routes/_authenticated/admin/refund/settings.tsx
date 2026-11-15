import { createFileRoute } from '@tanstack/react-router'
import { RefundRouteGuard, RefundSettingsPage } from '@/features/refund'
import { PERMISSIONS } from '@/shared/permissions'

export const Route = createFileRoute('/_authenticated/admin/refund/settings')({
  component: function Page() {
    return (
      <RefundRouteGuard permission={PERMISSIONS.REFUND.SETTINGS}>
        <RefundSettingsPage />
      </RefundRouteGuard>
    )
  },
})
