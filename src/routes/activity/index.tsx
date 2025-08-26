import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { Activity } from '@/features/activity'
import { executionStatuses, executionTypes } from '@/features/activity/data/data'

const executionSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  status: z
    .array(z.enum(executionStatuses.map((status) => status.value)))
    .optional()
    .catch([]),
  type: z
    .array(z.enum(executionTypes.map((type) => type.value)))
    .optional()
    .catch([]),
  playbookId: z.array(z.string()).optional().catch([]),
  filter: z.string().optional().catch(''),
})

export const Route = createFileRoute('/activity/')({
  validateSearch: executionSearchSchema,
  component: Activity,
})
