import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/education/all-categories',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/education/all-categories"!</div>
}
