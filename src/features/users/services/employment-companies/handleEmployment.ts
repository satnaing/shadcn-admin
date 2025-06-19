import supabase from '@/utils/supabase/client'
import { Database } from '@/utils/supabase/database.types'
import { UserEditType } from '../../data/schema'

type EmploymentCompaniesInsert =
  Database['public']['Tables']['employment_companies']['Insert']
export type EmploymentCompaniesUpdate =
  Database['public']['Tables']['employment_companies']['Update']

export const handleEmployment = async (editDataList: UserEditType) => {
  for (const editData of editDataList) {
    const data = editData.datas.employment_companies
    if (
      !data ||
      !data.company_id ||
      !data.job_id ||
      !data.start_date ||
      // !data.end_date ||
      !data.student_id
    ) {
      alert('누락된 현장 실습 정보가 있습니다.')
      continue
    }

    const insertData: EmploymentCompaniesInsert = {
      student_id: data.student_id,
      company_id: data.company_id,
      job_id: data.job_id,
      start_date: data.start_date,
      end_date: data.end_date,
    }

    const updateData: EmploymentCompaniesUpdate = {
      start_date: data.start_date,
      end_date: data.end_date,
      job_id: data.job_id,
    }

    switch (editData.action) {
      case 'add': {
        const { error } = await supabase
          .from('employment_companies')
          .insert([insertData])

        if (error) throw new Error(error.message)
        break
      }

      case 'update': {
        const { error } = await supabase
          .from('employment_companies')
          .update(updateData)
          .eq('student_id', data.student_id)
          .eq('company_id', data.company_id)

        if (error) throw new Error(error.message)
        break
      }

      case 'delete': {
        const { error } = await supabase
          .from('employment_companies')
          .delete()
          .eq('student_id', data.student_id)
          .eq('company_id', data.company_id)
          .eq('job_id', data.job_id)

        if (error) throw new Error(error.message)
        break
      }
    }
  }
}
