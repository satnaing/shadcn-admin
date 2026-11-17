import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { PageGuard } from '@/components/guard'
import { BlogsPage } from '@/features/blogs'
import { createListSearchSchema } from '@/shared/schemas/list-search.schema'
import { PERMISSIONS } from '@/shared/permissions'

export const Route = createFileRoute('/_authenticated/admin/blogs/')({
  validateSearch: createListSearchSchema({
    category: z.coerce.string().optional().catch(undefined),
  }),
  component: function BlogsRoute() {
    const search = Route.useSearch()
    const navigate = Route.useNavigate()

    return (
      <PageGuard permission={PERMISSIONS.BLOGS.INDEX}>
        <BlogsPage search={search} navigate={navigate} />
      </PageGuard>
    )
  },
})
