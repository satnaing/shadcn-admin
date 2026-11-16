import { describe, expect, it } from 'vitest'
import {
  courierSchema,
  notificationSchema,
  pickupSchema,
  settleSchema,
} from './data/courier.schema'

describe('courier schemas fix AEC gaps', () => {
  const base = {
    name: 'A',
    email: 'a@b.co',
    phone: '1',
    password: '',
    country_id: 1,
    state_id: 1,
    city_id: 1,
    avatar: null,
    address: '',
  }

  it('create needs a password (AEC hashed null), edit may leave it blank', () => {
    expect(courierSchema(true).safeParse(base).success).toBe(false)
    expect(
      courierSchema(true).safeParse({ ...base, password: 'abcdef' }).success
    ).toBe(true)
    expect(courierSchema(false).safeParse(base).success).toBe(true)
    expect(
      courierSchema(false).safeParse({ ...base, password: 'abc' }).success
    ).toBe(false)
  })

  it('region and e-mail are required and valid', () => {
    expect(
      courierSchema(false).safeParse({ ...base, city_id: 0 }).success
    ).toBe(false)
    expect(
      courierSchema(false).safeParse({ ...base, email: 'nope' }).success
    ).toBe(false)
  })

  it('settle amount must be above zero and within the balance', () => {
    const schema = settleSchema(100)
    expect(schema.safeParse({ amount: 0 }).success).toBe(false)
    expect(schema.safeParse({ amount: -5 }).success).toBe(false)
    expect(schema.safeParse({ amount: 100.01 }).success).toBe(false)
    expect(schema.safeParse({ amount: 100 }).success).toBe(true)
  })

  it('pickup coordinates stay on the globe', () => {
    expect(
      pickupSchema.safeParse({ pickup_latitude: '91', pickup_longitude: '0' })
        .success
    ).toBe(false)
    expect(
      pickupSchema.safeParse({
        pickup_latitude: '40.4',
        pickup_longitude: '49.8',
      }).success
    ).toBe(true)
    expect(
      pickupSchema.safeParse({ pickup_latitude: '', pickup_longitude: '' })
        .success
    ).toBe(true)
    expect(
      notificationSchema.safeParse({
        mail_notification: true,
        otp_notification: false,
      }).success
    ).toBe(true)
  })
})
