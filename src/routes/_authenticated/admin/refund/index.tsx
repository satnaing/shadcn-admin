import { createFileRoute } from '@tanstack/react-router'
import { RefundListPage, RefundRouteGuard } from '@/features/refund'
import { PERMISSIONS } from '@/shared/permissions'
import { createListSearchSchema } from '@/shared/schemas/list-search.schema'
import { z } from 'zod'

export const Route = createFileRoute('/_authenticated/admin/refund/')({
  validateSearch: createListSearchSchema({ tab: z.string().optional().catch(undefined) }),
  component: function Page() {
    const search = Route.useSearch()
    const navigate = Route.useNavigate()

    return (
      <RefundRouteGuard permission={PERMISSIONS.REFUND.INDEX}>
        <RefundListPage kind='refund' search={search} navigate={navigate} />
      </RefundRouteGuard>
    )
  },
})
