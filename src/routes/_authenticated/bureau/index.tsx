import { createFileRoute } from '@tanstack/react-router'
import Bureau from '@/features/bureau'
import { ProtectedRoute } from '@/components/ProtectedRoute'

export const Route = createFileRoute('/_authenticated/bureau/')({
  component: () => (
    <ProtectedRoute requiredService="bureau">
      <Bureau /> 
    </ProtectedRoute>
  ),
  
})