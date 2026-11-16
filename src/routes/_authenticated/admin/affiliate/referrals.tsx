import { z } from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { PERMISSIONS } from '@/shared/permissions'
import { createListSearchSchema } from '@/shared/schemas/list-search.schema'
import {
  AffiliateReferralsPage,
  AffiliateRouteGuard,
} from '@/features/affiliate'

export const Route = createFileRoute(
  '/_authenticated/admin/affiliate/referrals'
)({
  validateSearch: createListSearchSchema({
    tab: z.string().optional().catch(undefined),
  }),
  component: function Page() {
    const search = Route.useSearch()
    const navigate = Route.useNavigate()

    return (
      <AffiliateRouteGuard permission={PERMISSIONS.AFFILIATE.REFERRALS}>
        <AffiliateReferralsPage search={search} navigate={navigate} />
      </AffiliateRouteGuard>
    )
  },
})
