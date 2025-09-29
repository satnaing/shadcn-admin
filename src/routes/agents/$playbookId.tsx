import { z } from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import PlaybookDetailPage from '@/features/plays/pages/play'

const searchSchema = z.object({
  isNew: z.boolean().optional(),
})

export const Route = createFileRoute('/agents/$playbookId')({
  component: PlaybookDetailPage,
  validateSearch: searchSchema,
})
