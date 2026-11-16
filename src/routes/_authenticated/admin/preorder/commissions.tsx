import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { PreorderCommissionsPage, PreorderRouteGuard } from '@/features/preorder'
import { PERMISSIONS } from '@/shared/permissions'
import { createListSearchSchema } from '@/shared/schemas/list-search.schema'

export const Route = createFileRoute('/_authenticated/admin/preorder/commissions')({
  validateSearch: createListSearchSchema({ from: z.string().optional().catch(undefined), to: z.string().optional().catch(undefined) }),
  component: function Page() {
    const search = Route.useSearch()
    const navigate = Route.useNavigate()

    return (
      <PreorderRouteGuard permission={PERMISSIONS.PREORDER.COMMISSIONS}>
        <PreorderCommissionsPage search={search} navigate={navigate} />
      </PreorderRouteGuard>
    )
  },
})
