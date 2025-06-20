import { createFileRoute } from '@tanstack/react-router'
import Tasks from '@/features/tasks'
import { ProtectedRoute } from '@/components/ProtectedRoute'

export const Route = createFileRoute('/_authenticated/tasks/')({
  component: () => (
    <ProtectedRoute requiredService="tasks">
      <Tasks />
    </ProtectedRoute>
  ),
})
