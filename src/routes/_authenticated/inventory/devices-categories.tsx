import { createFileRoute } from '@tanstack/react-router'
import ComingSoon from '@/components/coming-soon.tsx'
export const Route = createFileRoute(
  '/_authenticated/inventory/devices-categories',
)({
  component: ComingSoon,
})


