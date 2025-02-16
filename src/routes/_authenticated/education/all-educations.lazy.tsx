import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute(
  '/_authenticated/education/all-educations',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/education/all-educations"!</div>
}
