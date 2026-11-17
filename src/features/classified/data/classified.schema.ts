import { z } from 'zod'
import type { ClassifiedPackage } from './classified.type'

const text = z.string().trim().max(255, 'classified:validation.max255')

/** AEC took any text for amount and upload count; both must be real, non-negative numbers (uploads whole). */
export const packageSchema = z.object({
  translations: z.object({
    az: text.min(1, 'required'),
    en: text,
    tr: text,
    ru: text,
  }),
  amount: z
    .number({ message: 'classified:validation.number' })
    .min(0, 'classified:validation.min0'),
  product_upload: z
    .number({ message: 'classified:validation.number' })
    .int('classified:validation.integer')
    .min(0, 'classified:validation.min0'),
  logo: z.string().min(1, 'required'),
})
export type PackageFormValues = z.infer<typeof packageSchema>

export const packageDefaults: PackageFormValues = {
  translations: { az: '', en: '', tr: '', ru: '' },
  amount: 0,
  product_upload: 0,
  logo: '',
}

export const packageToForm = (p: ClassifiedPackage): PackageFormValues => ({
  translations: { ...p.translations },
  amount: p.amount,
  product_upload: p.product_upload,
  logo: p.logo,
})
