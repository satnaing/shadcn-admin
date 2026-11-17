import { createFileRoute } from '@tanstack/react-router'
import { PERMISSIONS } from '@/shared/permissions'
import { MapProviderPage, MapProviderRouteGuard } from '@/features/map-provider'

export const Route = createFileRoute('/_authenticated/admin/map-provider/')({
  component: function Page() {
    return (
      <MapProviderRouteGuard permission={PERMISSIONS.MAP_PROVIDER.INDEX}>
        <MapProviderPage />
      </MapProviderRouteGuard>
    )
  },
})
