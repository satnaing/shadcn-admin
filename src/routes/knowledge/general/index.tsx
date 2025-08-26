import { createFileRoute } from '@tanstack/react-router'
import GeneralKnowledge from '@/features/knowledge/general'

export const Route = createFileRoute('/knowledge/general/')({
  component: GeneralKnowledge,
})
