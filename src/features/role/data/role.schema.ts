import { z } from 'zod'

export const roleSchema = z.object({
  name: z
    .string()
    .min(2, 'Role name must be at least 2 characters')
    .max(50, 'Role name must be at most 50 characters')
    .trim(),

  guard_name: z.string().min(3).trim(),

  permission_ids: z.array(z.number().int().positive()).default([]),
})

export type RoleFormValues = z.infer<typeof roleSchema>
