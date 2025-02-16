import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/education/new-education')(
  {
    component: RouteComponent,
  },
)

function RouteComponent() {
  return <div>Hello "/_authenticated/education/new-education"!</div>
}
