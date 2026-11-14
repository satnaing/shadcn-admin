import { createFileRoute } from '@tanstack/react-router'
import { PageGuard } from '@/components/guard'
import { PagesPage } from '@/features/pages'
import { createListSearchSchema } from '@/shared/schemas/list-search.schema'
import { PERMISSIONS } from '@/shared/permissions'
import { z } from 'zod'

export const Route = createFileRoute('/_authenticated/admin/pages/')({
  validateSearch: createListSearchSchema({ lang: z.string().optional() }),
  component: PagesRoute,
})

function PagesRoute() {
  const search = Route.useSearch()
  const navigate = Route.useNavigate()

  return (
    <PageGuard permission={PERMISSIONS.PAGES.INDEX}>
      <PagesPage search={search} navigate={navigate} />
    </PageGuard>
  )
}
