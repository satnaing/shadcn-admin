import { z } from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { PERMISSIONS } from '@/shared/permissions'
import { createListSearchSchema } from '@/shared/schemas/list-search.schema'
import { CourierLedgerPage, CourierRouteGuard } from '@/features/courier'

export const Route = createFileRoute('/_authenticated/admin/courier/earnings')({
  validateSearch: createListSearchSchema({
    tab: z.string().optional().catch(undefined),
  }),
  component: function Page() {
    const search = Route.useSearch()
    const navigate = Route.useNavigate()

    return (
      <CourierRouteGuard permission={PERMISSIONS.COURIER.EARNINGS}>
        <CourierLedgerPage
          kind='earnings'
          search={search}
          navigate={navigate}
        />
      </CourierRouteGuard>
    )
  },
})
