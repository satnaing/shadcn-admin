import { z } from 'zod'

const num = z.number({ message: 'club_point:validation.number' })
const points = num.min(0, 'club_point:validation.min0')

/** AEC allowed 0 here, then divided the earned points by it when a customer converted them. */
export const settingsSchema = z.object({
  convert_rate: num.gt(0, 'club_point:validation.positive'),
})
export type SettingsFormValues = z.infer<typeof settingsSchema>

export const productPointSchema = z.object({ point: points })
export type ProductPointFormValues = z.infer<typeof productPointSchema>

/** AEC only said "min should be less than max" in a hint and saved whatever was typed. */
export const rangeSchema = z
  .object({ point: points, min_price: points, max_price: points })
  .refine((v) => v.min_price <= v.max_price, {
    path: ['max_price'],
    message: 'club_point:validation.range',
  })
export type RangeFormValues = z.infer<typeof rangeSchema>

export const allProductsSchema = z.object({ point: points })
export type AllProductsFormValues = z.infer<typeof allProductsSchema>
