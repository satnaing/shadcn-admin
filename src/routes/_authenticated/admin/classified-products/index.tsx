import { createFileRoute } from '@tanstack/react-router'
import { ClassifiedList } from '@/features/classified/classified-list'

export const Route = createFileRoute(
  '/_authenticated/admin/classified-products/'
)({
  component: ClassifiedList,
})
