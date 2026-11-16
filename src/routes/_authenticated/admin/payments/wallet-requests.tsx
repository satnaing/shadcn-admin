import { z } from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { PERMISSIONS } from '@/shared/permissions'
import { createListSearchSchema } from '@/shared/schemas/list-search.schema'
import { PaymentsWalletPage, PaymentsRouteGuard } from '@/features/payments'

export const Route = createFileRoute('/_authenticated/admin/payments/wallet-requests')({
  validateSearch: createListSearchSchema({ tab: z.string().optional().catch(undefined) }),
  component: function Page() {
    const search = Route.useSearch()
    const navigate = Route.useNavigate()

    return (
      <PaymentsRouteGuard permission={PERMISSIONS.PAYMENTS.WALLET_REQUESTS}>
        <PaymentsWalletPage search={search} navigate={navigate} />
      </PaymentsRouteGuard>
    )
  },
})
