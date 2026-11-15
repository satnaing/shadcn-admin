import { z } from 'zod'
import type { ReasonItem } from './refund.type'

const days = z.number().int('refund:validation.integer').min(0, 'refund:validation.min0')

export const OTHERS = 'others'

export const rejectSchema = z
  .object({ preset: z.string().min(1, 'required'), custom: z.string().max(500) })
  .refine((v) => v.preset !== OTHERS || v.custom.trim().length > 0, { path: ['custom'], message: 'required' })
export type RejectFormValues = z.infer<typeof rejectSchema>

/** AEC lets the admin pick a preset reason or write one; the API stores the final text. */
export const rejectReasonText = (v: RejectFormValues) => (v.preset === OTHERS ? v.custom.trim() : v.preset)

export const offlinePaySchema = z.object({
  transaction_id: z.string().trim().min(1, 'required').max(191),
  receipt: z.string(),
})
export type OfflinePayFormValues = z.infer<typeof offlinePaySchema>

const text = z.string().trim().max(120, 'refund:validation.max120')

export const reasonSchema = z.object({
  kind: z.enum(['customer', 'rejection']),
  translations: z.object({ az: text.min(1, 'required'), en: text, tr: text, ru: text }),
})
export type ReasonFormValues = z.infer<typeof reasonSchema>

export const reasonDefaults: ReasonFormValues = {
  kind: 'customer',
  translations: { az: '', en: '', tr: '', ru: '' },
}

export const reasonToForm = (r: ReasonItem): ReasonFormValues => ({ kind: r.kind, translations: { ...r.translations } })

export const settingsSchema = z.object({
  approval_mode: z.enum(['admin_approval', 'seller_direct']),
  refund_type: z.enum(['global', 'category']),
  refund_days: days,
  dispute_enabled: z.boolean(),
  dispute_days: days,
  sticker: z.string(),
})
export type SettingsFormValues = z.infer<typeof settingsSchema>

export const daysSchema = z.object({ refund_days: days })
export type DaysFormValues = z.infer<typeof daysSchema>
