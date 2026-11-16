import { createFileRoute } from '@tanstack/react-router'
import { PERMISSIONS } from '@/shared/permissions'
import { ClubPointConfigPage, ClubPointRouteGuard } from '@/features/club-point'

export const Route = createFileRoute('/_authenticated/admin/club-point/config')(
  {
    component: function Page() {
      return (
        <ClubPointRouteGuard permission={PERMISSIONS.CLUB_POINT.CONFIG}>
          <ClubPointConfigPage />
        </ClubPointRouteGuard>
      )
    },
  }
)
