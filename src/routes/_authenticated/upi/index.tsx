import { createFileRoute } from '@tanstack/react-router'
import UPI from '@/features/UPI'
import { ProtectedRoute } from '@/components/ProtectedRoute'

export const Route = createFileRoute('/_authenticated/upi/')({
  component: () => (
    <ProtectedRoute requiredService="upi">
      <UPI />
    </ProtectedRoute>
  ),
})