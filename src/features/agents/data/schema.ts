import { z } from 'zod'

// Agent schema definition
export const agentSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  prompt: z.string().min(1, 'Prompt is required'),
  model: z.string().min(1, 'Model is required'),
  mode: z.enum(['chat', 'task']),
  isActive: z.boolean().default(true),
  createdAt: z.date(),
  updatedAt: z.date(),
  usageStats: z.object({
    totalCalls: z.number().default(0),
    successfulCalls: z.number().default(0),
    failedCalls: z.number().default(0),
    averageResponseTime: z.number().default(0),
    lastCalledAt: z.date().optional(),
  }).default({}),
})

export type Agent = z.infer<typeof agentSchema>