import { createFileRoute } from '@tanstack/react-router'
import ShopMenuPage from '@/features/shops/menu'

export const Route = createFileRoute('/_authenticated/shops/$id/menu')({
  component: ShopMenuPage,
})
