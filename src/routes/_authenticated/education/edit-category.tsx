import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/education/edit-category')(
  {
    component: RouteComponent,
  },
)

function RouteComponent() {
  return <div>Hello "/_authenticated/education/edit-category"!</div>
}
