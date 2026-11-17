import { createFileRoute } from '@tanstack/react-router'
import { PERMISSIONS } from '@/shared/permissions'
import {
  ClassifiedPackagesPage,
  ClassifiedRouteGuard,
} from '@/features/classified'

export const Route = createFileRoute(
  '/_authenticated/admin/classified/packages'
)({
  component: () => (
    <ClassifiedRouteGuard permission={PERMISSIONS.CLASSIFIED.PACKAGES}>
      <ClassifiedPackagesPage />
    </ClassifiedRouteGuard>
  ),
})
