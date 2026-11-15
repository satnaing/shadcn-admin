import { createFileRoute } from '@tanstack/react-router'
import { PageGuard } from '@/components/guard'
import { RolesPage } from '@/features/role'
import { createListSearchSchema } from '@/shared/schemas/list-search.schema'
import { PERMISSIONS } from '@/shared/permissions'

export const Route = createFileRoute('/_authenticated/admin/roles/')({
  validateSearch: createListSearchSchema({}),
  component: RolesRoute,
})

function RolesRoute() {
  const search = Route.useSearch()
  const navigate = Route.useNavigate()

  return (
    <PageGuard permission={PERMISSIONS.ROLES.INDEX}>
      <RolesPage search={search} navigate={navigate} />
    </PageGuard>
  )
}
