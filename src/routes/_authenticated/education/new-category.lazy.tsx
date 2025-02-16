import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute(
  '/_authenticated/education/new-category',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/education/new-category"!</div>
}
