import { createLazyFileRoute } from '@tanstack/react-router'
import ForbiddenError from '@/features/errors/forbidden'

export const Route = createLazyFileRoute('/(errors)/403')({
  component: ForbiddenError,
})
