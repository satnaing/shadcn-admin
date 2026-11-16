import { createFileRoute } from '@tanstack/react-router'
import { PreorderFaqsPage, PreorderRouteGuard } from '@/features/preorder'
import { PERMISSIONS } from '@/shared/permissions'
import { createListSearchSchema } from '@/shared/schemas/list-search.schema'

export const Route = createFileRoute('/_authenticated/admin/preorder/faqs')({
  validateSearch: createListSearchSchema(),
  component: function Page() {
    const search = Route.useSearch()
    const navigate = Route.useNavigate()

    return (
      <PreorderRouteGuard permission={PERMISSIONS.PREORDER.FAQS}>
        <PreorderFaqsPage search={search} navigate={navigate} />
      </PreorderRouteGuard>
    )
  },
})
