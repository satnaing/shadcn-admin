import { createFileRoute } from '@tanstack/react-router'
import { ProductCreate } from '@/features/products/product-create'

export const Route = createFileRoute('/_authenticated/admin/products/create')({
  component: ProductCreate,
})
