import NewEducation from '@/features/education/new-education'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute(
  '/_authenticated/education/new-education',
)({
  component: NewEducation,
})
