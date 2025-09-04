import { z } from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import PlaybookNewPage from '@/features/plays/new'

const searchSchema = z.object({
  templateId: z.string().optional(),
})

export const Route = createFileRoute('/plays/new')({
  component: PlaybookNewPage,
  validateSearch: searchSchema,
})
