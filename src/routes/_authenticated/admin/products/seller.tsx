import { createFileRoute } from '@tanstack/react-router'
import { ProductsSeller } from '@/features/products/products-seller'

export const Route = createFileRoute('/_authenticated/admin/products/seller')({
  component: ProductsSeller,
})
