import { z } from 'zod'

const deviceStatusSchema = z.union([
  z.literal('in_use'),
  z.literal('in_store'),
  z.literal('allocated'),
  z.literal('assigned'),
  z.literal('disposed'),
  z.literal('fault'),
])

const deviceTypeSchema = z.union([
  z.literal('laptop'),
  z.literal('printer'),
  z.literal('server'),
  z.literal('mobile'),
  z.literal('desktop'),
  z.literal('tablet'),
  z.literal('network_device'),
])


export type DeviceStatus = z.infer<typeof deviceStatusSchema>
export type DeviceType = z.infer<typeof deviceTypeSchema>

const deviceSchema = z.object({
  id: z.string(),
  device_name: z.string(),
  serial_number: z.string(),
  brand: z.string(),
  model: z.string(),
  processor: z.number(),
  RAM: z.number(),
  storage: z.number(),
  mac_address: z.string(),
  year_of_purchase: z.number(),
  status: deviceStatusSchema,
  device_type: deviceTypeSchema,
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})
export type Device = z.infer<typeof deviceSchema>

export const deviceListSchema = z.array(deviceSchema)
