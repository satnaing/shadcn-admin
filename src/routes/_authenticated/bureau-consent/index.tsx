import { createFileRoute } from '@tanstack/react-router'
import BureauConsent from '@/features/bureau-consent'
import { ProtectedRoute } from '@/components/ProtectedRoute'

export const Route = createFileRoute('/_authenticated/bureau-consent/')({
  component: () => (
    <ProtectedRoute requiredService="bureau-consent">
      <BureauConsent />
    </ProtectedRoute>
  ),
}) 