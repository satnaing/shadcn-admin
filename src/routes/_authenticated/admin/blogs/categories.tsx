import { createFileRoute } from '@tanstack/react-router'
import { PageGuard } from '@/components/guard'
import { BlogCategoriesPage } from '@/features/blogs'
import { createListSearchSchema } from '@/shared/schemas/list-search.schema'
import { PERMISSIONS } from '@/shared/permissions'

export const Route = createFileRoute('/_authenticated/admin/blogs/categories')({
  validateSearch: createListSearchSchema(),
  component: function BlogCategoriesRoute() {
    const search = Route.useSearch()
    const navigate = Route.useNavigate()

    return (
      <PageGuard permission={PERMISSIONS.BLOGS.CATEGORIES}>
        <BlogCategoriesPage search={search} navigate={navigate} />
      </PageGuard>
    )
  },
})
