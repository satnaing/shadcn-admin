import { createFileRoute } from '@tanstack/react-router'
import { KnowledgeBase } from '@/features/knowledge-base'

export const Route = createFileRoute('/_authenticated/knowledge-base/')({
  component: KnowledgeBase,
})
