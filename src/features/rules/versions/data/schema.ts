import { z } from 'zod'

export const ruleVersionSchema = z.object({
  id: z.string(),
  ruleNumber: z.string(),
  versionName: z.string(),
  versionStatus: z.enum(['enabled', 'observing', 'disabled']),
  description: z.string(),
  updatedAt: z.string(),
  createdAt: z.string(),
})

export type RuleVersion = z.infer<typeof ruleVersionSchema>
