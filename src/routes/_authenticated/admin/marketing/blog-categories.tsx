import { createFileRoute } from '@tanstack/react-router'
import { BlogCategoriesPage } from '@/features/marketing/blog-categories'

export const Route = createFileRoute(
  '/_authenticated/admin/marketing/blog-categories'
)({
  component: BlogCategoriesPage,
})
