import { createFileRoute } from '@tanstack/react-router'
import ForbiddenError from '@/features/errors/forbidden'
import GeneralError from '@/features/errors/general-error'
import MaintenanceError from '@/features/errors/maintenance-error'
import NotFoundError from '@/features/errors/not-found-error'
import UnauthorisedError from '@/features/errors/unauthorized-error'

export const Route = createFileRoute('/_authenticated/errors/$error')({
  component: RouteComponent,
})

function RouteComponent() {
  const { error } = Route.useParams()

  const errorMap: Record<string, React.ComponentType> = {
    unauthorized: UnauthorisedError,
    forbidden: ForbiddenError,
    'not-found': NotFoundError,
    'internal-server-error': GeneralError,
    'maintenance-error': MaintenanceError,
  }
  const ErrorComponent = errorMap[error] || NotFoundError

  return <ErrorComponent />
}
