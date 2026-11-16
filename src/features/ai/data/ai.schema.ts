import { z } from 'zod'
import { sameVariables, CONTENT_MODELS, TRANSLATE_MODELS } from './ai.models'

const required = 'ai:validation.required'

export const contentSchema = z.object({
  enabled: z.boolean(),
  model: z.enum(CONTENT_MODELS, { message: required }),
  api_key: z.string().trim().min(1, required).max(255, 'ai:validation.max255'),
  seller_monthly_token_limit: z.number({ message: required }).int('ai:validation.integer').min(0, 'ai:validation.min0'),
})
export type ContentFormValues = z.infer<typeof contentSchema>

export const translateSchema = z.object({
  enabled: z.boolean(),
  model: z.enum(TRANSLATE_MODELS, { message: required }),
  api_key: z.string().trim().min(1, required).max(255, 'ai:validation.max255'),
})
export type TranslateFormValues = z.infer<typeof translateSchema>

/** AEC only warned "do not change the variables"; the edited prompt must keep exactly the original variables. */
export function promptSchema(original: string) {
  return z.object({
    prompt: z
      .string()
      .trim()
      .min(1, required)
      .max(5000, 'ai:validation.max5000')
      .refine((v) => sameVariables(v, original), 'ai:validation.variables'),
  })
}
export type PromptFormValues = z.infer<ReturnType<typeof promptSchema>>
