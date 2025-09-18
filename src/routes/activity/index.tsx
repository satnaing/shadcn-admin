import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { Activity } from '@/features/activity'
import { executionStatuses, executionTypes } from '@/features/activity/data/data'

const executionSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(20),
  status: z
    .enum(executionStatuses.map((status) => status.value) as [string, ...string[]])
    .optional()
    .catch(undefined),
  type: z
    .enum(executionTypes.map((type) => type.value) as [string, ...string[]])
    .optional()
    .catch(undefined),
  playbookId: z.string().optional().catch(undefined),
  scenarioId: z.string().optional().catch(undefined),
  filter: z.string().optional().catch(''),
  executionId: z.string().optional().catch(undefined),
})

export const Route = createFileRoute('/activity/')({
  validateSearch: executionSearchSchema,
  component: Activity,
})
