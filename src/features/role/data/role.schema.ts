import { z } from 'zod'

export const roleSchema = z.object({
  name: z.string().trim().min(2).max(50),
  description: z.string().trim().max(200),
  permissions: z.array(z.string()),
})

export type RoleFormValues = z.infer<typeof roleSchema>
