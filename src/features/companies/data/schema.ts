import { z } from 'zod'

const companyStatusSchema = z.union([
  z.literal('active'),
  z.literal('inactive'),
  z.literal('invited'),
  z.literal('suspended'),
])
export type CompanyStatus = z.infer<typeof companyStatusSchema>

const companyRoleSchema = z.union([
  z.literal('superadmin'),
  z.literal('admin'),
  z.literal('cashier'),
  z.literal('manager'),
])

const companySchema = z.object({
  id: z.string(),
  companyName: z.string(),
  // email: z.string(),
  // phoneNumber: z.string(),
  status: companyStatusSchema,
  role: companyRoleSchema,
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})
export type Company = z.infer<typeof companySchema>

export const companyListSchema = z.array(companySchema)
