import { z } from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { PERMISSIONS } from '@/shared/permissions'
import { createListSearchSchema } from '@/shared/schemas/list-search.schema'
import { PosProductsPage, PosRouteGuard } from '@/features/pos'

// ids look numeric (`?category=2`): coerce so the router keeps them as strings
export const Route = createFileRoute('/_authenticated/admin/pos/products')({
  validateSearch: createListSearchSchema({
    category: z.coerce.string().optional().catch(undefined),
    seller: z.coerce.string().optional().catch(undefined),
  }),
  component: function Page() {
    const search = Route.useSearch()
    const navigate = Route.useNavigate()

    return (
      <PosRouteGuard permission={PERMISSIONS.POS.PRODUCTS}>
        <PosProductsPage search={search} navigate={navigate} />
      </PosRouteGuard>
    )
  },
})
