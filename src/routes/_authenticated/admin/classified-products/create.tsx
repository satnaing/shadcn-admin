import { createFileRoute } from '@tanstack/react-router'
import { ClassifiedCreate } from '@/features/classified/classified-create'

export const Route = createFileRoute(
  '/_authenticated/admin/classified-products/create'
)({
  component: ClassifiedCreate,
})
