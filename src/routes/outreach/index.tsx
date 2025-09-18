import { z } from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import OutreachFeature from '@/features/outreach'

const searchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(20),
  filter: z.string().optional().catch(''),
  status: z.string().optional().catch(undefined),
  senderId: z.string().optional().catch(undefined),
})

export const Route = createFileRoute('/outreach/')({
  validateSearch: searchSchema,
  component: OutreachFeature,
})
