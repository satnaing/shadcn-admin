import { createFileRoute } from '@tanstack/react-router'
import Users from '@/features/users'
import { ProtectedRoute } from '@/components/ProtectedRoute'

export const Route = createFileRoute('/_authenticated/users/')({
  // component: () => (
  //   <ProtectedRoute requiredService="users">
  //     Users 
  //   </ProtectedRoute>
  // ),
  component: Users,
})
