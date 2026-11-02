import { createFileRoute } from '@tanstack/react-router'
import { ProductReviews } from '@/features/products/product-reviews'

export const Route = createFileRoute('/_authenticated/admin/products/reviews')({
  component: ProductReviews,
})
