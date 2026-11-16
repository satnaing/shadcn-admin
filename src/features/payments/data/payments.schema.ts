import { z } from 'zod'
import { MANUAL_TYPES, PAYOUT_TYPES, PAYRIFF_MODES, type BankRow } from './payments.type'

const required = 'payments:validation.required'
const text = (max: number) => z.string().trim().max(max, `payments:validation.max${max}`)
const requiredText = (max: number) => text(max).min(1, required)

export const emptyBankRow: BankRow = { bank_name: '', account_name: '', account_number: '', routing_number: '' }

const bankRow = z.object({
  bank_name: requiredText(120),
  account_name: requiredText(120),
  account_number: requiredText(60),
  routing_number: text(60),
})

/** AEC validated nothing server-side: a bank method with no rows crashed, the heading was only `required` in the browser. */
export const manualSchema = z
  .object({
    type: z.enum(MANUAL_TYPES, { message: required }),
    heading: requiredText(120),
    description: text(2000),
    photo: z.string(),
    bank_info: z.array(bankRow),
  })
  .refine((v) => v.type !== 'bank_payment' || v.bank_info.length > 0, {
    message: 'payments:validation.bankRows',
    path: ['bank_info'],
  })
export type ManualFormValues = z.infer<typeof manualSchema>
export const manualDefaults: ManualFormValues = {
  type: 'custom_payment',
  heading: '',
  description: '',
  photo: '',
  bank_info: [],
}

export const payoutSchema = z.object({
  type: z.enum(PAYOUT_TYPES, { message: required }),
  name: requiredText(120),
  logo: z.string().min(1, required),
})
export type PayoutFormValues = z.infer<typeof payoutSchema>
export const payoutDefaults: PayoutFormValues = { type: 'bank_payment', name: '', logo: '' }

/** AEC accepted any amount here (even negative, which lowered the balance). */
export const rechargeSchema = z.object({
  user_id: z.number({ message: 'payments:validation.customer' }).int().positive('payments:validation.customer'),
  amount: z.number({ message: required }).positive('payments:validation.amount'),
  trx_id: requiredText(100),
  photo: z.string(),
})
export type RechargeFormValues = z.infer<typeof rechargeSchema>
export const rechargeDefaults = { amount: 0, trx_id: '', photo: '' } as const

/** The credentials of the chosen mode must be filled in (AEC saved an empty live key and failed at checkout). */
export const payriffSchema = z
  .object({
    display_name: text(60),
    mode: z.enum(PAYRIFF_MODES, { message: required }),
    test_merchant_id: text(60),
    test_secret_key: text(255),
    production_merchant_id: text(60),
    production_secret_key: text(255),
  })
  .superRefine((v, ctx) => {
    for (const field of ['merchant_id', 'secret_key'] as const) {
      const name = `${v.mode}_${field}` as const
      if (v[name] === '') ctx.addIssue({ code: 'custom', message: required, path: [name] })
    }
  })
export type PayriffFormValues = z.infer<typeof payriffSchema>
