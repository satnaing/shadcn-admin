import { createFileRoute } from '@tanstack/react-router'
import { PreorderOrderDetailPage, PreorderRouteGuard } from '@/features/preorder'
import { PERMISSIONS } from '@/shared/permissions'

export const Route = createFileRoute('/_authenticated/admin/preorder/orders/$id')({
  component: function Page() {
    const { id } = Route.useParams()

    return (
      <PreorderRouteGuard permission={PERMISSIONS.PREORDER.ORDERS}>
        <PreorderOrderDetailPage id={id} />
      </PreorderRouteGuard>
    )
  },
})
