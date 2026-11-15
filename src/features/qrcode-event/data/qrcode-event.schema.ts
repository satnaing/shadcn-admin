import { z } from 'zod'
import { CAMPAIGN_STATUSES, PRIZE_TYPES, type CampaignDetail, type PrizeItem } from './qrcode-event.type'

const int = (min: number, max?: number) => {
  const n = z.number().int().min(min)
  return max ? n.max(max) : n
}

export const campaignSchema = z.object({
  name: z.string().trim().min(1, 'required').max(191),
  slug: z.string(),
  status: z.enum(CAMPAIGN_STATUSES as [string, ...string[]]),
  starts_at: z.string(),
  ends_at: z.string(),
  code_prefix: z.string().max(6),
  is_login_required: z.boolean(),
  prize_delivery: z.enum(['manual', 'wallet']),
  max_checks_per_hour: int(1),
  max_failed_per_hour: int(1),
  block_minutes: int(1),
  description: z.string(),
  terms: z.string(),
  banner: z.string(),
})
export type CampaignFormValues = z.infer<typeof campaignSchema>

export const campaignDefaults: CampaignFormValues = {
  name: '', slug: '', status: 'draft', starts_at: '', ends_at: '', code_prefix: '',
  is_login_required: true, prize_delivery: 'manual', max_checks_per_hour: 30,
  max_failed_per_hour: 10, block_minutes: 60, description: '', terms: '', banner: '',
}

export const campaignToForm = (c: CampaignDetail): CampaignFormValues => ({
  name: c.name, slug: c.slug, status: c.status, starts_at: c.starts_at ?? '', ends_at: c.ends_at ?? '',
  code_prefix: c.code_prefix ?? '', is_login_required: c.is_login_required, prize_delivery: c.prize_delivery,
  max_checks_per_hour: c.max_checks_per_hour, max_failed_per_hour: c.max_failed_per_hour,
  block_minutes: c.block_minutes, description: c.description, terms: c.terms, banner: c.banner,
})

export const prizeSchema = z
  .object({
    type: z.enum(PRIZE_TYPES as [string, ...string[]]),
    title: z.string().trim().min(1, 'required').max(191),
    value: z.number().min(0),
    quantity: int(1),
    product_ids: z.array(z.number()),
    description: z.string(),
    image: z.string(),
    sort_order: int(0),
  })
  .superRefine((v, ctx) => {
    if (v.type === 'product' && v.product_ids.length === 0) {
      ctx.addIssue({ code: 'custom', path: ['product_ids'], message: 'required' })
    }
  })
export type PrizeFormValues = z.infer<typeof prizeSchema>

export const prizeDefaults: PrizeFormValues = {
  type: 'cash', title: '', value: 0, quantity: 1, product_ids: [], description: '', image: '', sort_order: 0,
}

export const prizeToForm = (p: PrizeItem): PrizeFormValues => ({
  type: p.type, title: p.title, value: p.value, quantity: p.quantity, product_ids: p.product_ids,
  description: p.description, image: p.image, sort_order: p.sort_order,
})

/** `prize_allocation`: how many of a batch's codes win each prize (prize id → count). */
export const batchSchema = z
  .object({
    campaign_id: z.number().min(1, 'required'),
    quantity: int(1, 200000),
    prize_allocation: z.record(z.string(), int(0)),
    product_id: z.number().nullable(),
    note: z.string().max(255),
  })
  .superRefine((v, ctx) => {
    const winners = Object.values(v.prize_allocation).reduce((sum, n) => sum + n, 0)
    if (winners > v.quantity) {
      ctx.addIssue({ code: 'custom', path: ['prize_allocation'], message: 'qrcode_event:validation.allocationTooHigh' })
    }
  })
export type BatchFormValues = z.infer<typeof batchSchema>

export const batchDefaults: BatchFormValues = {
  campaign_id: 0, quantity: 100, prize_allocation: {}, product_id: null, note: '',
}

export const settingsSchema = z.object({
  android_package: z.string(),
  android_sha256: z.string(),
  ios_team_id: z.string(),
  ios_bundle_id: z.string(),
})
export type SettingsFormValues = z.infer<typeof settingsSchema>

export const claimSchema = z.object({ claim_note: z.string().max(255) })
export type ClaimFormValues = z.infer<typeof claimSchema>
