import { z } from 'zod'

export const badgeSchema = z.object({
  id: z.string().optional(),
  label: z.object({
    en: z.string().min(1, { message: 'English label is required' }),
    km: z.string().optional(),
  }),
  code: z.string().min(2, { message: 'Code is required' }).toUpperCase(),
  bgColor: z
    .string()
    .min(4, { message: 'Background color is required' })
    .regex(/^#/, { message: 'Must be a valid hex color' }),
  textColor: z
    .string()
    .min(4, { message: 'Text color is required' })
    .regex(/^#/, { message: 'Must be a valid hex color' }),
  imageUrl: z.string().optional(),
  isActive: z.boolean(),
})

export type Badge = z.infer<typeof badgeSchema>
