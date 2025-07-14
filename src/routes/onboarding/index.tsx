import { createFileRoute } from '@tanstack/react-router'
import { Navigate } from '@tanstack/react-router'

export const Route = createFileRoute('/onboarding/')({
  component: () => <Navigate to='/onboarding/extension' />,
})
