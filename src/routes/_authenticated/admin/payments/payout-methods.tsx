import { createFileRoute } from '@tanstack/react-router'
import { PERMISSIONS } from '@/shared/permissions'
import { createListSearchSchema } from '@/shared/schemas/list-search.schema'
import { PaymentsPayoutPage, PaymentsRouteGuard } from '@/features/payments'

export const Route = createFileRoute('/_authenticated/admin/payments/payout-methods')({
  validateSearch: createListSearchSchema(),
  component: function Page() {
    const search = Route.useSearch()
    const navigate = Route.useNavigate()

    return (
      <PaymentsRouteGuard permission={PERMISSIONS.PAYMENTS.PAYOUT_METHODS}>
        <PaymentsPayoutPage search={search} navigate={navigate} />
      </PaymentsRouteGuard>
    )
  },
})
