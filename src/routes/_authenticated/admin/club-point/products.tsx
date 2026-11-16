import { createFileRoute } from '@tanstack/react-router'
import { PERMISSIONS } from '@/shared/permissions'
import { createListSearchSchema } from '@/shared/schemas/list-search.schema'
import {
  ClubPointProductsPage,
  ClubPointRouteGuard,
} from '@/features/club-point'

export const Route = createFileRoute(
  '/_authenticated/admin/club-point/products'
)({
  validateSearch: createListSearchSchema(),
  component: function Page() {
    const search = Route.useSearch()
    const navigate = Route.useNavigate()

    return (
      <ClubPointRouteGuard permission={PERMISSIONS.CLUB_POINT.PRODUCTS}>
        <ClubPointProductsPage search={search} navigate={navigate} />
      </ClubPointRouteGuard>
    )
  },
})
