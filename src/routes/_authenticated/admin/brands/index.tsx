import { createFileRoute } from '@tanstack/react-router'
import { BrandsPage } from '@/features/brands'

export const Route = createFileRoute('/_authenticated/admin/brands/')({
  component: BrandsPage,
})
