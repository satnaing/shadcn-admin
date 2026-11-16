import { createFileRoute } from '@tanstack/react-router'
import { PreorderSettingsPage, PreorderRouteGuard } from '@/features/preorder'
import { PERMISSIONS } from '@/shared/permissions'

export const Route = createFileRoute('/_authenticated/admin/preorder/settings')({
  component: function Page() {
    return (
      <PreorderRouteGuard permission={PERMISSIONS.PREORDER.SETTINGS}>
        <PreorderSettingsPage />
      </PreorderRouteGuard>
    )
  },
})
