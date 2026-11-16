import { createFileRoute } from '@tanstack/react-router'
import { PERMISSIONS } from '@/shared/permissions'
import { createListSearchSchema } from '@/shared/schemas/list-search.schema'
import { PaymentsPackagesPage, PaymentsRouteGuard } from '@/features/payments'

export const Route = createFileRoute('/_authenticated/admin/payments/customer-packages')({
  validateSearch: createListSearchSchema(),
  component: function Page() {
    const search = Route.useSearch()
    const navigate = Route.useNavigate()

    return (
      <PaymentsRouteGuard permission={PERMISSIONS.PAYMENTS.CUSTOMER_PACKAGES}>
        <PaymentsPackagesPage kind='customer' search={search} navigate={navigate} />
      </PaymentsRouteGuard>
    )
  },
})
