import { createFileRoute } from '@tanstack/react-router'
import { PERMISSIONS } from '@/shared/permissions'
import { CourierConfigPage, CourierRouteGuard } from '@/features/courier'

export const Route = createFileRoute('/_authenticated/admin/courier/config')({
  component: function Page() {
    return (
      <CourierRouteGuard permission={PERMISSIONS.COURIER.CONFIG}>
        <CourierConfigPage />
      </CourierRouteGuard>
    )
  },
})
