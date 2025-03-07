import { createLazyFileRoute } from '@tanstack/react-router'
import WorkFlow from '@/features/work-flow'

export const Route = createLazyFileRoute('/_authenticated/work-flow/')({
  component: WorkFlow,
})
