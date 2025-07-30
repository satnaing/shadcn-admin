import { createFileRoute } from '@tanstack/react-router'
import CreditRepair from '@/features/credit-repair'
import { ProtectedRoute } from '@/components/ProtectedRoute'

export const Route = createFileRoute('/_authenticated/credit-repair/')({
  component: () => (
    //need to define requiredService  here
    <ProtectedRoute requiredService="credit-repair">
      <CreditRepair/>
    </ProtectedRoute>
  ),
})
