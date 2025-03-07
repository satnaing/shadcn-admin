import { createLazyFileRoute } from '@tanstack/react-router'
import Calender from '@/features/calender'

export const Route = createLazyFileRoute('/_authenticated/calender/')({
  component: Calender,
})
