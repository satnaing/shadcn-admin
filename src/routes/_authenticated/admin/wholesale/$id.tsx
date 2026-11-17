import { createFileRoute } from '@tanstack/react-router'
import { PERMISSIONS } from '@/shared/permissions'
import {
  WholesaleProductEditPage,
  WholesaleRouteGuard,
} from '@/features/wholesale'

export const Route = createFileRoute('/_authenticated/admin/wholesale/$id')({
  component: function Page() {
    const { id } = Route.useParams()

    return (
      <WholesaleRouteGuard permission={PERMISSIONS.WHOLESALE.EDIT}>
        <WholesaleProductEditPage id={id} />
      </WholesaleRouteGuard>
    )
  },
})
