import { z } from 'zod'
import { Database } from '@/utils/supabase/database.types'

// const companyStatusSchema = z.union([
//   z.literal('active'),
//   z.literal('inactive'),
//   z.literal('invited'),
//   z.literal('suspended'),
// ])
// export type CompanyStatus = z.infer<typeof companyStatusSchema>

// const companyRoleSchema = z.union([
//   z.literal('superadmin'),
//   z.literal('admin'),
//   z.literal('cashier'),
//   z.literal('manager'),
// ])

const companySchema = z.object({
  company_id: z.number(),
  company_name: z.string(),
  hr_manager_name: z.string(),
  hr_manager_phone: z.string(),
  company_address: z.string(),
  // email: z.string(),
  // phoneNumber: z.string(),
  // status: companyStatusSchema,
  // role: companyRoleSchema,
  // createdAt: z.coerce.date(),
  // updatedAt: z.coerce.date(),
})
export type Company = z.infer<typeof companySchema>

export const companyListSchema = z.array(companySchema)

export type CompanySupabase = Database['enum']['Tables']['companies']['Row']
