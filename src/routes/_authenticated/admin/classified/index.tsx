import { createFileRoute } from '@tanstack/react-router'
import { PERMISSIONS } from '@/shared/permissions'
import { createListSearchSchema } from '@/shared/schemas/list-search.schema'
import {
  ClassifiedProductsPage,
  ClassifiedRouteGuard,
} from '@/features/classified'

export const Route = createFileRoute('/_authenticated/admin/classified/')({
  validateSearch: createListSearchSchema(),
  component: function Page() {
    const search = Route.useSearch()
    const navigate = Route.useNavigate()

    return (
      <ClassifiedRouteGuard permission={PERMISSIONS.CLASSIFIED.INDEX}>
        <ClassifiedProductsPage search={search} navigate={navigate} />
      </ClassifiedRouteGuard>
    )
  },
})
