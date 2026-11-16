import { z } from 'zod'

const text = z.string().trim().min(1, 'pos:validation.required')
const id = z
  .number({ message: 'pos:validation.required' })
  .int()
  .positive('pos:validation.required')

/** AEC refused an order without phone AND email only in the controller; the form checks it up front. */
export const guestSchema = z
  .object({
    name: text,
    phone: z.string().trim(),
    email: z.string().trim().email('pos:validation.email').or(z.literal('')),
    address: text,
  })
  .refine((v) => v.phone !== '' || v.email !== '', {
    message: 'pos:validation.phoneOrEmail',
    path: ['phone'],
  })

export const addressSchema = z.object({
  address: text,
  country_id: id,
  state_id: id,
  city_id: id,
  postal_code: z.string().trim(),
  phone: text,
})
export type AddressFormValues = z.infer<typeof addressSchema>
export const addressDefaults: AddressFormValues = {
  address: '',
  country_id: 0,
  state_id: 0,
  city_id: 0,
  postal_code: '',
  phone: '',
}

export const offlineSchema = z.object({
  method: text,
  trx_id: z.string().trim(),
  proof: z.string().nullable(),
})
export type OfflineFormValues = z.infer<typeof offlineSchema>

/** AEC saved any text as the printer width. */
export const printWidthSchema = z.object({
  print_width: z
    .number({ message: 'pos:validation.number' })
    .int('pos:validation.number')
    .min(30, 'pos:validation.width')
    .max(300, 'pos:validation.width'),
})
export type PrintWidthValues = z.infer<typeof printWidthSchema>
