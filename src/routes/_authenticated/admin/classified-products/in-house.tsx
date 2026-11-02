import { createFileRoute } from '@tanstack/react-router'
import { ClassifiedInHouse } from '@/features/classified/classified-in-house'

export const Route = createFileRoute(
  '/_authenticated/admin/classified-products/in-house'
)({
  component: ClassifiedInHouse,
})
