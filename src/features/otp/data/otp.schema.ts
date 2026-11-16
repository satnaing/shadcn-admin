import { z } from 'zod'
import { GATEWAY_FIELDS, type GatewayField } from './otp.gateways'
import type { GatewayKey } from './otp.type'

const required = 'otp:validation.required'

/** `[[code]]`-style variables of an SMS body. */
export const placeholders = (text: string): string[] => [
  ...new Set([...text.matchAll(/\[\[\s*([a-z_]+)\s*\]\]/g)].map((m) => m[1])),
]

const sameSet = (a: string[], b: string[]) => a.length === b.length && a.every((x) => b.includes(x))

/** AEC only printed "do not change the variables" under the textarea; now the variables must stay exactly as they were. */
export function templateSchema(original: string) {
  const expected = placeholders(original)

  return z.object({
    body: z
      .string()
      .trim()
      .min(1, required)
      .max(1000, 'otp:validation.max1000')
      .refine((v) => sameSet(placeholders(v), expected), 'otp:validation.placeholders'),
    template_id: z.string().trim().max(60, 'otp:validation.max60'),
    active: z.boolean(),
  })
}
export type TemplateFormValues = z.infer<ReturnType<typeof templateSchema>>

const fieldRule = (f: GatewayField) => {
  if (f.options) {
    const options = f.options
    return z.string().refine((v) => (f.required ? options.includes(v) : v === '' || options.includes(v)), required)
  }
  const text = z.string().trim().max(255, 'otp:validation.max255')
  const typed = f.url ? text.refine((v) => v === '' || /^https?:\/\/\S+$/i.test(v), 'otp:validation.url') : text
  return f.required ? typed.refine((v) => v.length > 0, required) : typed
}

/** Credentials form of one gateway: required fields, selects limited to their options, URLs checked (AEC checked none of it). */
export function gatewaySchema(key: GatewayKey) {
  return z.object(Object.fromEntries(GATEWAY_FIELDS[key].map((f) => [f.name, fieldRule(f)])))
}
export type GatewayFormValues = Record<string, string>

export const bulkSmsSchema = z.object({
  phones: z.array(z.string()).min(1, 'otp:validation.recipients').max(500, 'otp:validation.max500'),
  content: z.string().trim().min(1, required).max(1000, 'otp:validation.max1000'),
  template_id: z.string().trim().max(60, 'otp:validation.max60'),
})
export type BulkSmsFormValues = z.infer<typeof bulkSmsSchema>
export const bulkSmsDefaults: BulkSmsFormValues = { phones: [], content: '', template_id: '' }
