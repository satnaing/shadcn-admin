import { z } from 'zod'
import { Database } from '@/utils/supabase/database.types'

export const companySchema = z.object({
  company_id: z.number(),
  company_name: z.string().min(1, { message: '회사이름을 입력해주세요.' }),
  hr_manager_name: z.string().min(1, { message: '인사 담당자 이름을 입력해주세요.' }),
  hr_manager_phone: z.string().min(1, { message: '인사 담당자 연락처를 입력해주세요.' }),
  company_address: z.string().min(1, { message: '회사 주소를 입력해주세요.' }),
  isEdit: z.boolean(),
})

export const companyFormSchema = companySchema.omit({ company_id: true })
export const companyWithoutEdit = companySchema.omit({ isEdit: true })

export type Company = z.infer<typeof companyWithoutEdit>
export type CompanyForm = z.infer<typeof companyFormSchema>

export type CompanyFormFieldType = keyof Omit<Company, 'company_id' | 'isEdit'>

export const companyFieldMetadata: Record<
CompanyFormFieldType, 
  { label: string; placeholder: string;}
> = {
  company_name: { label: '회사 이름', placeholder: '예: ABC 주식회사' },
  hr_manager_name: { label: '인사 담당자 이름', placeholder: '예: 홍길동' },
  hr_manager_phone: { label: '인사 담당자 연락처', placeholder: '예: 010-1234-5678' },
  company_address: { label: '회사 주소', placeholder: '예: 서울특별시 강남구' },
}

export type CompanySupabase = Database['enum']['Tables']['companies']['Row']
