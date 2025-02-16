import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute(
  '/_authenticated/education/edit-education',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/education/edit-education"!</div>
}
