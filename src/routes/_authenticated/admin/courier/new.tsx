import { createFileRoute } from '@tanstack/react-router'
import { PERMISSIONS } from '@/shared/permissions'
import { CourierFormPage, CourierRouteGuard } from '@/features/courier'

export const Route = createFileRoute('/_authenticated/admin/courier/new')({
  component: function Page() {
    return (
      <CourierRouteGuard permission={PERMISSIONS.COURIER.CREATE}>
        <CourierFormPage />
      </CourierRouteGuard>
    )
  },
})
