import { createFileRoute } from '@tanstack/react-router'
import { ProductsList } from '@/features/products'

export const Route = createFileRoute('/_authenticated/admin/products/')({
  component: ProductsList,
})
