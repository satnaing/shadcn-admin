import { createFileRoute } from '@tanstack/react-router'
import { BlogCreatePage } from '@/features/marketing/blog-create'

export const Route = createFileRoute(
  '/_authenticated/admin/marketing/blogs/create'
)({
  component: BlogCreatePage,
})
