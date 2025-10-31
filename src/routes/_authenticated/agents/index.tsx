import { createFileRoute } from '@tanstack/react-router'
import { Agents } from '@/features/agents'

export const Route = createFileRoute('/_authenticated/agents/')({
  component: () => <Agents />,
})