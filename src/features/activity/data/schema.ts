import { z } from 'zod'

export const executionSchema = z.object({
  id: z.string(),
  createdAt: z.string(),
  completedAt: z.string().nullable(),
  result: z
    .object({
      shortSummary: z.string().nullable(),
    })
    .nullable(),
  summary: z.string().nullable(),
  status: z.string(),
  playbookId: z.string().nullable(),
  entityId: z.string().nullable(),
  entityType: z.string().nullable(),
  type: z.string(),
  errorMessage: z.string().nullable(),
  initiatedBy: z.string().nullable(),
  initiatedFrom: z.string(),
})

export type Execution = z.infer<typeof executionSchema>
