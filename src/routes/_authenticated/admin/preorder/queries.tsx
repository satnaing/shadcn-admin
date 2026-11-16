import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { PreorderQueriesPage, PreorderRouteGuard } from '@/features/preorder'
import { PERMISSIONS } from '@/shared/permissions'
import { createListSearchSchema } from '@/shared/schemas/list-search.schema'

export const Route = createFileRoute('/_authenticated/admin/preorder/queries')({
  validateSearch: createListSearchSchema({ state: z.string().optional().catch(undefined) }),
  component: function Page() {
    const search = Route.useSearch()
    const navigate = Route.useNavigate()

    return (
      <PreorderRouteGuard permission={PERMISSIONS.PREORDER.QUERIES}>
        <PreorderQueriesPage search={search} navigate={navigate} />
      </PreorderRouteGuard>
    )
  },
})
