import { z } from 'zod'

const text = z.string().trim().min(1, 'courier:validation.required')
const id = z
  .number({ message: 'courier:validation.required' })
  .int()
  .positive('courier:validation.required')
const money = z
  .number({ message: 'courier:validation.number' })
  .min(0, 'courier:validation.min0')

/** AEC created accounts without checking the password at all (`Hash::make(null)`); create requires one, edit keeps the old when blank. */
const password = (isCreate: boolean) =>
  z
    .string()
    .refine(
      (v) => (isCreate ? v.length >= 6 : v === '' || v.length >= 6),
      'courier:validation.password'
    )

export const courierSchema = (isCreate: boolean) =>
  z.object({
    name: text,
    email: z.string().trim().email('courier:validation.email'),
    phone: text,
    password: password(isCreate),
    country_id: id,
    state_id: id,
    city_id: id,
    avatar: z.string().nullable(),
    address: z.string(),
  })
export type CourierFormValues = z.infer<ReturnType<typeof courierSchema>>

export const courierDefaults: CourierFormValues = {
  name: '',
  email: '',
  phone: '',
  password: '',
  country_id: 0,
  state_id: 0,
  city_id: 0,
  avatar: null,
  address: '',
}

/** AEC only compared with `>` after the fact, so 0 and negative amounts went through. */
export const settleSchema = (max: number) =>
  z.object({
    amount: z
      .number({ message: 'courier:validation.number' })
      .gt(0, 'courier:validation.positive')
      .max(max, 'courier:validation.max'),
  })
export type SettleFormValues = z.infer<ReturnType<typeof settleSchema>>

export const paymentSchema = z.object({
  payment_type: z.enum(['salary', 'commission']),
  salary: money,
  commission: money,
})
export type PaymentFormValues = z.infer<typeof paymentSchema>

export const notificationSchema = z.object({
  mail_notification: z.boolean(),
  otp_notification: z.boolean(),
})
export type NotificationFormValues = z.infer<typeof notificationSchema>

const coordinate = (min: number, max: number) =>
  z
    .string()
    .refine(
      (v) =>
        v === '' ||
        (!Number.isNaN(Number(v)) && Number(v) >= min && Number(v) <= max),
      'courier:validation.coordinate'
    )
export const pickupSchema = z.object({
  pickup_latitude: coordinate(-90, 90),
  pickup_longitude: coordinate(-180, 180),
})
export type PickupFormValues = z.infer<typeof pickupSchema>
