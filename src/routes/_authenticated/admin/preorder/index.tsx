import { createFileRoute } from '@tanstack/react-router'
import { PreorderDashboardPage, PreorderRouteGuard } from '@/features/preorder'
import { PERMISSIONS } from '@/shared/permissions'

export const Route = createFileRoute('/_authenticated/admin/preorder/')({
  component: function Page() {
    return (
      <PreorderRouteGuard permission={PERMISSIONS.PREORDER.INDEX}>
        <PreorderDashboardPage />
      </PreorderRouteGuard>
    )
  },
})
