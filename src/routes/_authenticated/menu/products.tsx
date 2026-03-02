import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/menu/products')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/menu/products"!</div>
}
