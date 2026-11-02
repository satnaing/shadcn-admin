import { createFileRoute } from '@tanstack/react-router'
import { ProductsInHouse } from '@/features/products/products-in-house'

export const Route = createFileRoute(
  '/_authenticated/admin/products/in-house'
)({
  component: ProductsInHouse,
})
