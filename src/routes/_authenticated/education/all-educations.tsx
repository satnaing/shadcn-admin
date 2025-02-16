import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/education/all-educations',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/education/all-educations"!</div>
}
