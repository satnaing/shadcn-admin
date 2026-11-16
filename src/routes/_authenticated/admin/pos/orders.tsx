import { z } from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { PERMISSIONS } from '@/shared/permissions'
import { createListSearchSchema } from '@/shared/schemas/list-search.schema'
import { PosOrdersPage, PosRouteGuard } from '@/features/pos'

export const Route = createFileRoute('/_authenticated/admin/pos/orders')({
  validateSearch: createListSearchSchema({
    tab: z.string().optional().catch(undefined),
  }),
  component: function Page() {
    const search = Route.useSearch()
    const navigate = Route.useNavigate()

    return (
      <PosRouteGuard permission={PERMISSIONS.POS.ORDERS}>
        <PosOrdersPage search={search} navigate={navigate} />
      </PosRouteGuard>
    )
  },
})
