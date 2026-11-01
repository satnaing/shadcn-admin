import { z } from 'zod'
import i18next from 'i18next'

export const permissionSchema = z.object({
  name: z.string().min(1, i18next.t('common:validation.nameRequired')),
  guard_name: z
    .string()
    .min(1, i18next.t('common:validation.guardNameRequired')),
})

export type PermissionFormValues = z.infer<typeof permissionSchema>
