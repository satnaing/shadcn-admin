import { z } from 'zod'
import i18next from 'i18next'

export const baseUserSchema = z.object({
  name: z.string().min(2, i18next.t('users:validation.nameRequired')),
  email: z.email(i18next.t('users:validation.emailInvalid')),
  role_ids: z
    .array(z.number())
    .min(1, i18next.t('users:validation.roleRequired')),
})

export const createUserSchema = baseUserSchema
  .extend({
    password: z
      .string()
      .min(8, i18next.t('users:validation.passwordMin'))
      .regex(/[A-Z]/, i18next.t('users:validation.passwordUppercase'))
      .regex(/[0-9]/, i18next.t('users:validation.passwordNumber')),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: i18next.t('users:validation.passwordMismatch'),
    path: ['password_confirmation'],
  })

export const updateUserSchema = baseUserSchema
  .extend({
    password: z.string().optional(),
    password_confirmation: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const password = data.password?.trim() ?? ''
    if (password === '') {
      return
    }

    if (password.length < 8) {
      ctx.addIssue({
        code: 'custom',
        path: ['password'],
        message: i18next.t('users:validation.passwordMin'),
      })
    }

    if (!/[A-Z]/.test(password)) {
      ctx.addIssue({
        code: 'custom',
        path: ['password'],
        message: i18next.t('users:validation.passwordUppercase'),
      })
    }

    if (!/[0-9]/.test(password)) {
      ctx.addIssue({
        code: 'custom',
        path: ['password'],
        message: i18next.t('users:validation.passwordNumber'),
      })
    }

    if (password !== (data.password_confirmation ?? '')) {
      ctx.addIssue({
        code: 'custom',
        path: ['password_confirmation'],
        message: i18next.t('users:validation.passwordMismatch'),
      })
    }
  })

export type CreateUserFormValues = z.infer<typeof createUserSchema>
export type UpdateUserFormValues = z.infer<typeof updateUserSchema>
