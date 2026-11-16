import { z } from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { PERMISSIONS } from '@/shared/permissions'
import { createListSearchSchema } from '@/shared/schemas/list-search.schema'
import {
  ClubPointEarningsPage,
  ClubPointRouteGuard,
} from '@/features/club-point'

export const Route = createFileRoute('/_authenticated/admin/club-point/')({
  validateSearch: createListSearchSchema({
    tab: z.string().optional().catch(undefined),
  }),
  component: function Page() {
    const search = Route.useSearch()
    const navigate = Route.useNavigate()

    return (
      <ClubPointRouteGuard permission={PERMISSIONS.CLUB_POINT.INDEX}>
        <ClubPointEarningsPage search={search} navigate={navigate} />
      </ClubPointRouteGuard>
    )
  },
})
