import { createFileRoute } from '@tanstack/react-router'
import BBPS from '@/features/BBPS'
import { ProtectedRoute } from '@/components/ProtectedRoute'

export const Route = createFileRoute('/_authenticated/bbps/')({
  component: () => (
    <ProtectedRoute requiredService="BBPS">
      <BBPS />
    </ProtectedRoute>
  ),
})
