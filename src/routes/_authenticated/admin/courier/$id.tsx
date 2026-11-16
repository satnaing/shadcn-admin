import { createFileRoute } from '@tanstack/react-router'
import { PERMISSIONS } from '@/shared/permissions'
import { CourierFormPage, CourierRouteGuard } from '@/features/courier'

export const Route = createFileRoute('/_authenticated/admin/courier/$id')({
  component: function Page() {
    const { id } = Route.useParams()

    return (
      <CourierRouteGuard permission={PERMISSIONS.COURIER.EDIT}>
        <CourierFormPage id={id} />
      </CourierRouteGuard>
    )
  },
})
