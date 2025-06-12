import { z } from 'zod'

 

const customerSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  username: z.string(),
  email: z.string(),
  phoneNumber: z.string(),
  refferal_code: z.string().optional(),
   
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})
export type Customer = z.infer<typeof customerSchema>

export const customerListSchema = z.array(customerSchema)
