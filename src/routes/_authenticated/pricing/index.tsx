import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/pricing/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/pricing/"!</div>
}
