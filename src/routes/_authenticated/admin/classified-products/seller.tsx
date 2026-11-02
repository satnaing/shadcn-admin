import { createFileRoute } from '@tanstack/react-router'
import { ClassifiedSeller } from '@/features/classified/classified-seller'

export const Route = createFileRoute(
  '/_authenticated/admin/classified-products/seller'
)({
  component: ClassifiedSeller,
})
