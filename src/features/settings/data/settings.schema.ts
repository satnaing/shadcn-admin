import { z } from 'zod'
import type { FieldDef } from './settings.type'

const fieldSchema = ({ type, required }: FieldDef) => {
  switch (type) {
    case 'switch':
      return z.boolean()
    case 'number':
      return z.number().int().min(0)
    case 'email': {
      const email = z.string().trim().pipe(z.email())
      return required ? email : z.union([z.literal(''), email])
    }
    case 'url': {
      const url = z.string().trim().pipe(z.url())
      return required ? url : z.union([z.literal(''), url])
    }
    default: {
      const text = z.string().trim().max(500)
      return required ? text.min(1) : text
    }
  }
}

export const buildGroupSchema = (fields: FieldDef[]) =>
  z.object(Object.fromEntries(fields.map((f) => [f.name, fieldSchema(f)])))

export const currencySchema = z.object({
  code: z.string().trim().toUpperCase().length(3),
  name: z.string().trim().min(2).max(60),
  symbol: z.string().trim().min(1).max(5),
  exchange_rate: z.number().positive(),
  decimal_places: z.number().int().min(0).max(4),
  position: z.enum(['before', 'after']),
  is_active: z.boolean(),
})

export type CurrencyFormValues = z.infer<typeof currencySchema>
