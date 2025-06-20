import { z } from 'zod'

const customerSchema = z.object({
  id: z.union([z.string(), z.number()]),
  name: z.string().optional(),
  mobile: z.string().optional(),
  email: z.string().optional(),
  dob: z.string().optional(),
  pin_code: z.string().optional(),
  vpa: z.string().optional(),
  upi_linked: z.string().optional(),
  utm_source: z.string().optional(),
  category: z.string().optional(),
  created_at: z.string().optional(),
})
export type Customer = z.infer<typeof customerSchema>

export const customerListSchema = z.array(customerSchema)
