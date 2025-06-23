import { createFileRoute } from '@tanstack/react-router'
import Apps from '@/features/apps'
import { ProtectedRoute } from '@/components/ProtectedRoute'

export const Route = createFileRoute('/_authenticated/apps/')({
  component: () => (
    <ProtectedRoute requiredService="apps">
      <Apps />
    </ProtectedRoute>
  ),
})
