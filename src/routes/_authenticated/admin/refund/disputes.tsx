import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { RefundListPage, RefundRouteGuard } from '@/features/refund'
import { PERMISSIONS } from '@/shared/permissions'
import { createListSearchSchema } from '@/shared/schemas/list-search.schema'

export const Route = createFileRoute('/_authenticated/admin/refund/disputes')({
  validateSearch: createListSearchSchema({ tab: z.string().optional().catch(undefined) }),
  component: function Page() {
    const search = Route.useSearch()
    const navigate = Route.useNavigate()

    return (
      <RefundRouteGuard permission={PERMISSIONS.REFUND.DISPUTES}>
        <RefundListPage kind='dispute' search={search} navigate={navigate} />
      </RefundRouteGuard>
    )
  },
})
