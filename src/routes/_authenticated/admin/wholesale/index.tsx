import { z } from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { PERMISSIONS } from '@/shared/permissions'
import { createListSearchSchema } from '@/shared/schemas/list-search.schema'
import {
  WholesaleProductsPage,
  WholesaleRouteGuard,
} from '@/features/wholesale'

export const Route = createFileRoute('/_authenticated/admin/wholesale/')({
  validateSearch: createListSearchSchema({
    owner: z.string().optional().catch(undefined),
    seller: z.coerce.string().optional().catch(undefined),
  }),
  component: function Page() {
    const search = Route.useSearch()
    const navigate = Route.useNavigate()

    // Each tab has its own permission; the tab bar hides the ones the user lacks.
    return (
      <WholesaleRouteGuard permission={PERMISSIONS.WHOLESALE.INDEX}>
        <WholesaleProductsPage search={search} navigate={navigate} />
      </WholesaleRouteGuard>
    )
  },
})
