import { z } from 'zod'
import { CHOICE_TYPES, ELEMENT_TYPES, PAY_METHODS } from './affiliate.type'

const num = z.number({ message: 'affiliate:validation.number' })
const money = num.min(0, 'affiliate:validation.min0')
const commissionType = z.enum(['amount', 'percent'])

/** A percent commission cannot exceed 100; AEC only limited the input box and let amounts above 100 % through. */
const withinType = (v: { commission: number; commission_type: string }) =>
  v.commission_type !== 'percent' || v.commission <= 100
const percentRule = {
  path: ['commission'],
  message: 'affiliate:validation.max100',
}

export const settingsSchema = z.object({
  minimum_withdraw_amount: money,
  validation_days: num
    .int('affiliate:validation.integer')
    .min(0, 'affiliate:validation.min0'),
})
export type SettingsFormValues = z.infer<typeof settingsSchema>

export const firstPurchaseSchema = z.object({
  status: z.boolean(),
  percentage: money.max(100, 'affiliate:validation.max100'),
})
export type FirstPurchaseFormValues = z.infer<typeof firstPurchaseSchema>

export const productSharingSchema = z
  .object({
    status: z.boolean(),
    commission: money,
    commission_type: commissionType,
  })
  .refine(withinType, percentRule)
export type ProductSharingFormValues = z.infer<typeof productSharingSchema>

export const categoryWiseSchema = z.object({
  status: z.boolean(),
  items: z.array(
    z
      .object({
        category_id: z.number(),
        category_name: z.string(),
        commission: money,
        commission_type: commissionType,
      })
      .refine(withinType, percentRule)
  ),
})
export type CategoryWiseFormValues = z.infer<typeof categoryWiseSchema>

const elementSchema = z
  .object({
    type: z.enum(ELEMENT_TYPES as [string, ...string[]]),
    label: z.string().trim().min(1, 'required').max(120),
    options: z.array(z.string().trim().min(1, 'required').max(120)),
  })
  .refine(
    (v) => !CHOICE_TYPES.includes(v.type as never) || v.options.length > 0,
    {
      path: ['options'],
      message: 'affiliate:validation.optionsRequired',
    }
  )
export const registrationFormSchema = z.object({
  elements: z.array(elementSchema),
})
export type RegistrationFormValues = z.infer<typeof registrationFormSchema>

/** AEC accepted any amount, even above the balance (negative due amount); the limit is the current balance. */
export const payoutSchema = (max: number) =>
  z.object({
    amount: num
      .gt(0, 'affiliate:validation.positive')
      .max(max, 'affiliate:validation.maxBalance'),
    payment_method: z.enum(PAY_METHODS as ['Paypal', 'Bank'], {
      message: 'required',
    }),
  })
export type PayoutFormValues = z.infer<ReturnType<typeof payoutSchema>>
