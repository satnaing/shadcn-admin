import NewEducation from '@/features/education/new-education'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/education/new-education')(
  {
    component: NewEducation,
  },
)
