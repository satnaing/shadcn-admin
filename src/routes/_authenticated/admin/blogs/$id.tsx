import { createFileRoute } from '@tanstack/react-router'
import { PageGuard } from '@/components/guard'
import { BlogEditPage } from '@/features/blogs'
import { PERMISSIONS } from '@/shared/permissions'

export const Route = createFileRoute('/_authenticated/admin/blogs/$id')({
  component: function BlogEditRoute() {
    const { id } = Route.useParams()

    return (
      <PageGuard permission={PERMISSIONS.BLOGS.UPDATE}>
        <BlogEditPage id={id} />
      </PageGuard>
    )
  },
})
