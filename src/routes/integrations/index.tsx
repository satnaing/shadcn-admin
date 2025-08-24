import { createFileRoute } from '@tanstack/react-router'
import { Integrations } from '@/features/integrations'

export const Route = createFileRoute('/integrations/')({
  component: Integrations,
})
