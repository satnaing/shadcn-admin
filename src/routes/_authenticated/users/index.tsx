import { createFileRoute } from '@tanstack/react-router'
import Users from '@/features/users'

export const Route = createFileRoute('/_authenticated/users/')({
  component: Users,
})
