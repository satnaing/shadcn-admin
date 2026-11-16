import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { PreorderOrdersPage, PreorderRouteGuard } from '@/features/preorder'
import { PERMISSIONS } from '@/shared/permissions'
import { createListSearchSchema } from '@/shared/schemas/list-search.schema'

export const Route = createFileRoute('/_authenticated/admin/preorder/orders/')({
  validateSearch: createListSearchSchema({ scope: z.string().optional().catch(undefined), stage: z.string().optional().catch(undefined), from: z.string().optional().catch(undefined), to: z.string().optional().catch(undefined) }),
  component: function Page() {
    const search = Route.useSearch()
    const navigate = Route.useNavigate()

    return (
      <PreorderRouteGuard permission={PERMISSIONS.PREORDER.ORDERS}>
        <PreorderOrdersPage search={search} navigate={navigate} />
      </PreorderRouteGuard>
    )
  },
})
