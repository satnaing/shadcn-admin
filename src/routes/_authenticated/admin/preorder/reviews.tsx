import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { PreorderReviewsPage, PreorderRouteGuard } from '@/features/preorder'
import { PERMISSIONS } from '@/shared/permissions'
import { createListSearchSchema } from '@/shared/schemas/list-search.schema'

export const Route = createFileRoute('/_authenticated/admin/preorder/reviews')({
  validateSearch: createListSearchSchema({ owner: z.string().optional().catch(undefined) }),
  component: function Page() {
    const search = Route.useSearch()
    const navigate = Route.useNavigate()

    return (
      <PreorderRouteGuard permission={PERMISSIONS.PREORDER.REVIEWS}>
        <PreorderReviewsPage search={search} navigate={navigate} />
      </PreorderRouteGuard>
    )
  },
})
