import { z } from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { PERMISSIONS } from '@/shared/permissions'
import { createListSearchSchema } from '@/shared/schemas/list-search.schema'
import { AffiliateUsersPage, AffiliateRouteGuard } from '@/features/affiliate'

export const Route = createFileRoute('/_authenticated/admin/affiliate/users')({
  validateSearch: createListSearchSchema({
    tab: z.string().optional().catch(undefined),
  }),
  component: function Page() {
    const search = Route.useSearch()
    const navigate = Route.useNavigate()

    return (
      <AffiliateRouteGuard permission={PERMISSIONS.AFFILIATE.USERS}>
        <AffiliateUsersPage search={search} navigate={navigate} />
      </AffiliateRouteGuard>
    )
  },
})
