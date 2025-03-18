import { createLazyFileRoute } from '@tanstack/react-router'
import Integration from '@/features/integrations'

export const Route = createLazyFileRoute('/_authenticated/integration/')({
  component: Integration,
})


