import { createFileRoute } from '@tanstack/react-router'
import { PreorderProductEditPage, PreorderRouteGuard } from '@/features/preorder'
import { PERMISSIONS } from '@/shared/permissions'

export const Route = createFileRoute('/_authenticated/admin/preorder/products/$id')({
  component: function Page() {
    const { id } = Route.useParams()

    return (
      <PreorderRouteGuard permission={PERMISSIONS.PREORDER.PRODUCTS_MANAGE}>
        <PreorderProductEditPage id={id} />
      </PreorderRouteGuard>
    )
  },
})
