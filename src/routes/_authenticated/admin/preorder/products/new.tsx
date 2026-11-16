import { createFileRoute } from '@tanstack/react-router'
import { PreorderProductForm, PreorderRouteGuard } from '@/features/preorder'
import { PERMISSIONS } from '@/shared/permissions'

export const Route = createFileRoute('/_authenticated/admin/preorder/products/new')({
  component: function Page() {
    return (
      <PreorderRouteGuard permission={PERMISSIONS.PREORDER.PRODUCTS_MANAGE}>
        <PreorderProductForm />
      </PreorderRouteGuard>
    )
  },
})
