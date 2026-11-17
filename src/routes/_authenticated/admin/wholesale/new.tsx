import { createFileRoute } from '@tanstack/react-router'
import { PERMISSIONS } from '@/shared/permissions'
import { WholesaleProductForm, WholesaleRouteGuard } from '@/features/wholesale'

export const Route = createFileRoute('/_authenticated/admin/wholesale/new')({
  component: function Page() {
    return (
      <WholesaleRouteGuard permission={PERMISSIONS.WHOLESALE.CREATE}>
        <WholesaleProductForm />
      </WholesaleRouteGuard>
    )
  },
})
