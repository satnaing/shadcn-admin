import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { RefundReasonsPage, RefundRouteGuard } from '@/features/refund'
import { PERMISSIONS } from '@/shared/permissions'
import { createListSearchSchema } from '@/shared/schemas/list-search.schema'

export const Route = createFileRoute('/_authenticated/admin/refund/reasons')({
  validateSearch: createListSearchSchema({ kind: z.string().optional().catch(undefined) }),
  component: function Page() {
    const search = Route.useSearch()
    const navigate = Route.useNavigate()

    return (
      <RefundRouteGuard permission={PERMISSIONS.REFUND.REASONS}>
        <RefundReasonsPage search={search} navigate={navigate} />
      </RefundRouteGuard>
    )
  },
})
