import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { RefundCategoriesPage, RefundRouteGuard } from '@/features/refund'
import { PERMISSIONS } from '@/shared/permissions'
import { createListSearchSchema } from '@/shared/schemas/list-search.schema'

export const Route = createFileRoute('/_authenticated/admin/refund/categories')({
  validateSearch: createListSearchSchema({
    main: z.coerce.string().optional().catch(undefined),
    unassigned: z.coerce.string().optional().catch(undefined),
  }),
  component: function Page() {
    const search = Route.useSearch()
    const navigate = Route.useNavigate()

    return (
      <RefundRouteGuard permission={PERMISSIONS.REFUND.CATEGORIES}>
        <RefundCategoriesPage search={search} navigate={navigate} />
      </RefundRouteGuard>
    )
  },
})
