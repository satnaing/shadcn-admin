import { z } from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { PERMISSIONS } from '@/shared/permissions'
import { createListSearchSchema } from '@/shared/schemas/list-search.schema'
import {
  AffiliateWithdrawsPage,
  AffiliateRouteGuard,
} from '@/features/affiliate'

export const Route = createFileRoute(
  '/_authenticated/admin/affiliate/withdraws'
)({
  validateSearch: createListSearchSchema({
    tab: z.string().optional().catch(undefined),
  }),
  component: function Page() {
    const search = Route.useSearch()
    const navigate = Route.useNavigate()

    return (
      <AffiliateRouteGuard permission={PERMISSIONS.AFFILIATE.WITHDRAWS}>
        <AffiliateWithdrawsPage search={search} navigate={navigate} />
      </AffiliateRouteGuard>
    )
  },
})
