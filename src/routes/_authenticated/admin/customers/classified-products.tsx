import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/admin/customers/classified-products'
)({
  beforeLoad: () => {
    throw redirect({ to: '/admin/classified-products' })
  },
})
