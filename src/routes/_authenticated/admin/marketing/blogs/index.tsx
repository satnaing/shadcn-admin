import { createFileRoute } from '@tanstack/react-router'
import { BlogsPage } from '@/features/marketing/blogs'

export const Route = createFileRoute('/_authenticated/admin/marketing/blogs/')({
  component: BlogsPage,
})
