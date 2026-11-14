import { createFileRoute } from '@tanstack/react-router'
import { PageGuard } from '@/components/guard'
import { BlogForm } from '@/features/blogs'
import { PERMISSIONS } from '@/shared/permissions'

export const Route = createFileRoute('/_authenticated/admin/blogs/new')({
  component: () => (
    <PageGuard permission={PERMISSIONS.BLOGS.CREATE}>
      <BlogForm />
    </PageGuard>
  ),
})
